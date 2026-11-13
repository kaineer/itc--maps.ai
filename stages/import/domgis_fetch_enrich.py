#!/usr/bin/env python3
"""Fetch GIS ZhKH houses for Ekaterinburg (sharded) and enrich buildings.json heights."""
from __future__ import annotations

import json
import re
import time
import uuid
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path("/home/kaineer/devel/itc/maps.ai/stages/import")
CURL_PATHS = [ROOT / "domgis.curl", ROOT / "domgis2.curl"]
CACHE_DIR = ROOT / "domgis_cache"
HOUSES_OUT = ROOT / "domgis_houses.json"
BUILDINGS = Path(
    "/home/kaineer/devel/itc/itc-images/mock-maps/data/buildings.json"
)
METERS_PER_LEVEL = 3.0
PAGE_SIZE = 100
MAX_PAGE = 19  # API returns empty body from page 20 when offset >= ~1900
SLEEP = 0.75
BURST_EVERY = 8
BURST_SLEEP = 4.0

COOKIE = ""
SESSION = ""
AUTH_SOURCE = Path()


def parse_auth(path: Path) -> tuple[str, str]:
    text = path.read_text(encoding="utf-8")
    cookie = re.search(r"-b '([^']+)'", text)
    session = re.search(r"Session-GUID:\s*([^\s'\\]+)", text)
    if not cookie or not session:
        raise RuntimeError(f"Cannot parse cookie/session from {path}")
    return cookie.group(1), session.group(1)


def load_auth(prefer_fallback: bool = False) -> tuple[str, str, Path]:
    paths = list(CURL_PATHS)
    if prefer_fallback:
        paths = list(reversed(paths))
    last_error: Exception | None = None
    for path in paths:
        if not path.exists():
            continue
        try:
            cookie, session = parse_auth(path)
            return cookie, session, path
        except Exception as exc:  # noqa: BLE001
            last_error = exc
    raise RuntimeError(f"No usable curl auth file in {CURL_PATHS}: {last_error}")


def apply_auth(prefer_fallback: bool = False) -> Path:
    global COOKIE, SESSION, AUTH_SOURCE
    cookie, session, source = load_auth(prefer_fallback=prefer_fallback)
    COOKIE, SESSION, AUTH_SOURCE = cookie, session, source
    print(f"auth loaded from {source}", flush=True)
    return source


apply_auth(prefer_fallback=False)

STREET_TYPES = {
    "улица": "ул",
    "ул": "ул",
    "проспект": "пр-кт",
    "пр-кт": "пр-кт",
    "просп": "пр-кт",
    "пр": "пр-кт",
    "переулок": "пер",
    "пер": "пер",
    "бульвар": "б-р",
    "б-р": "б-р",
    "бул": "б-р",
    "площадь": "пл",
    "пл": "пл",
    "шоссе": "ш",
    "ш": "ш",
    "набережная": "наб",
    "наб": "наб",
    "тракт": "тракт",
    "проезд": "проезд",
    "тупик": "туп",
    "туп": "туп",
    "аллея": "аллея",
    "линия": "линия",
    "микрорайон": "мкр",
    "мкр": "мкр",
}


def base_body(**overrides) -> dict:
    body = {
        "regionCode": "92b30014-4d52-4e2e-892d-928142b924bf",
        "cityCode": "2763c110-cb8b-416a-9dac-ad28a55b4402",
        "fiasHouseCodeList": None,
        "estStatus": None,
        "strStatus": None,
        "calcCount": True,
        "houseConditionRefList": ["1", "3", "2", "0"],
        "houseTypeRefList": ["2", "3", "1"],
        "houseManagementTypeRefList": ["8", "3", "4", "6", "1", "2", "5", "0"],
        "cadastreNumber": None,
        "oktmo": None,
        "statuses": ["APPROVED"],
        "regionProperty": None,
        "municipalProperty": None,
        "hostelTypeCodes": None,
        "useReadOnlyDataSource": True,
        "streetCode": None,
    }
    body.update(overrides)
    return body


def fetch_page(body: dict, page: int, page_size: int = PAGE_SIZE) -> dict:
    url = (
        "https://dom.gosuslugi.ru/homemanagement/api/rest/services/houses/public/"
        f"searchByAddress?pageIndex={page}&elementsPerPage={page_size}"
    )
    req = urllib.request.Request(
        url, data=json.dumps(body, ensure_ascii=False).encode("utf-8"), method="POST"
    )
    for key, value in {
        "Accept": "application/json; charset=utf-8",
        "Content-Type": "application/json;charset=UTF-8",
        "Cookie": COOKIE,
        "Origin": "https://dom.gosuslugi.ru",
        "Referer": "https://dom.gosuslugi.ru/",
        "Request-GUID": str(uuid.uuid4()),
        "Session-GUID": SESSION,
        "State-GUID": "/houses",
        "User-Agent": (
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36"
        ),
    }.items():
        req.add_header(key, value)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {exc.code}: {raw[:200]}") from exc
    if not raw:
        return {"empty": True, "items": [], "total": 0}
    if raw[:1] not in "{[":
        raise RuntimeError(f"non-json: {raw[:200]}")
    return json.loads(raw)


def _looks_like_auth_error(exc: Exception) -> bool:
    text = str(exc)
    return any(
        marker in text
        for marker in (
            "HTTP 401",
            "HTTP 403",
            "Access Denied",
            "non-json",
            "Challenge=",
        )
    )


def fetch_page_retry(body: dict, page: int) -> dict:
    switched = False
    for attempt in range(8):
        try:
            return fetch_page(body, page)
        except Exception as exc:
            if _looks_like_auth_error(exc) and not switched:
                fallback = ROOT / "domgis2.curl"
                if fallback.exists() and AUTH_SOURCE != fallback:
                    print(
                        f"  auth failed ({exc}); switching to {fallback}",
                        flush=True,
                    )
                    apply_auth(prefer_fallback=True)
                    switched = True
                    continue
            wait = min(60, 2**attempt + 1)
            print(f"  retry page={page} ({exc}); sleep {wait}s", flush=True)
            time.sleep(wait)
    raise RuntimeError(f"failed page {page}")


def shard_label(body: dict) -> str:
    rp = body.get("regionProperty")
    mp = body.get("municipalProperty")
    rp_s = "x" if rp is None else ("1" if rp else "0")
    mp_s = "x" if mp is None else ("1" if mp else "0")
    return (
        f"t{'-'.join(body['houseTypeRefList'])}"
        f"_m{'-'.join(body['houseManagementTypeRefList'])}"
        f"_c{'-'.join(body['houseConditionRefList'])}"
        f"_rp{rp_s}_mp{mp_s}"
        f"_s{body.get('streetCode') or 'none'}"
    )


def save_items(path: Path, items: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(items, ensure_ascii=False), encoding="utf-8")


def load_items(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return json.loads(path.read_text(encoding="utf-8"))


def download_query(body: dict, label: str) -> list[dict]:
    out_path = CACHE_DIR / f"{label}.json"
    if out_path.exists() and out_path.stat().st_size > 2:
        items = load_items(out_path)
        print(f"cache hit {label}: {len(items)}", flush=True)
        return items

    first = fetch_page_retry(body, 1)
    if first.get("empty"):
        save_items(out_path, [])
        return []
    total = int(first.get("total") or 0)
    items = list(first.get("items") or [])
    pages = min(MAX_PAGE, max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE))
    print(f"{label}: total={total} pages={pages}", flush=True)
    for page in range(2, pages + 1):
        time.sleep(SLEEP)
        data = fetch_page_retry(body, page)
        if data.get("empty"):
            print(f"  empty at page {page}, stop", flush=True)
            break
        items.extend(data.get("items") or [])
        if page % BURST_EVERY == 0:
            time.sleep(BURST_SLEEP)
    save_items(out_path, items)
    print(f"  saved {len(items)} -> {out_path.name}", flush=True)
    return items


def collect_street_codes(items: list[dict]) -> dict[str, str]:
    streets: dict[str, str] = {}
    for item in items:
        street = (item.get("address") or {}).get("street") or {}
        code = street.get("aoGuid")
        name = street.get("formalName") or street.get("offName") or ""
        if code:
            streets[code] = name
    return streets


def merge_cache_houses() -> tuple[dict[str, dict], dict[str, str]]:
    by_guid: dict[str, dict] = {}
    streets: dict[str, str] = {}
    for path in CACHE_DIR.glob("*.json"):
        items = load_items(path)
        for item in items:
            guid = item.get("guid")
            if guid:
                by_guid[guid] = item
        streets.update(collect_street_codes(items))
    return by_guid, streets


def iter_shard_bodies() -> list[dict]:
    bodies: list[dict] = []
    # Base type × management × condition
    for ht in ("1", "2", "3"):
        for mt in ("8", "3", "4", "6", "1", "2", "5", "0"):
            for cond in ("0", "1", "2", "3"):
                bodies.append(
                    base_body(
                        houseTypeRefList=[ht],
                        houseManagementTypeRefList=[mt],
                        houseConditionRefList=[cond],
                    )
                )
    # Extra boolean partitions for large residential/mgmt buckets
    for ht, mt, cond in (("2", "0", "2"), ("1", "5", "2"), ("2", "0", "0")):
        for rp, mp in (
            (False, None),
            (None, False),
            (False, False),
        ):
            bodies.append(
                base_body(
                    houseTypeRefList=[ht],
                    houseManagementTypeRefList=[mt],
                    houseConditionRefList=[cond],
                    regionProperty=rp,
                    municipalProperty=mp,
                )
            )
    return bodies


def download_all() -> list[dict]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    by_guid, streets = merge_cache_houses()
    print(
        f"resume: houses={len(by_guid)} streets={len(streets)} cookie=…{COOKIE[20:40]}",
        flush=True,
    )

    for body in iter_shard_bodies():
        probe = fetch_page_retry(body, 1)
        time.sleep(SLEEP)
        total = int(probe.get("total") or 0)
        if total <= 0:
            continue
        label = shard_label(body)
        if total <= MAX_PAGE * PAGE_SIZE:
            items = download_query(body, label)
        else:
            items = download_query(body, f"{label}_head")
        for item in items:
            guid = item.get("guid")
            if guid:
                by_guid[guid] = item
        streets.update(collect_street_codes(items))
        print(f"streets={len(streets)} houses={len(by_guid)}", flush=True)

    # Fetch only streets not yet cached
    pending = [
        (code, name)
        for code, name in sorted(streets.items(), key=lambda kv: kv[1])
        if not (CACHE_DIR / f"street_{code}.json").exists()
    ]
    print(f"new streets to fetch: {len(pending)} / known {len(streets)}", flush=True)
    for idx, (code, name) in enumerate(pending, 1):
        body = base_body(streetCode=code)
        items = download_query(body, f"street_{code}")
        for item in items:
            guid = item.get("guid")
            if guid:
                by_guid[guid] = item
        if idx % 20 == 0 or idx == len(pending):
            print(
                f"street {idx}/{len(pending)} ({name}) houses={len(by_guid)}",
                flush=True,
            )

    houses = list(by_guid.values())
    HOUSES_OUT.write_text(json.dumps(houses, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {len(houses)} houses -> {HOUSES_OUT}", flush=True)
    return houses


def norm_text(value: str) -> str:
    value = (value or "").lower().replace("ё", "е")
    value = value.replace("«", "").replace("»", "").replace('"', "")
    value = re.sub(r"[.,;]", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def norm_housenumber(value: str) -> str:
    value = norm_text(value).replace(" ", "")
    value = value.replace("корпус", "к").replace("корп", "к")
    return value


def parse_osm_address(address: str) -> tuple[str, str] | None:
    if not address:
        return None
    text = re.sub(r"^г\.?\s*екатеринбург,?\s*", "", address.strip(), flags=re.I)
    if "," not in text:
        return None
    left, right = text.rsplit(",", 1)
    parts = []
    for part in norm_text(left).split():
        if part.rstrip(".") in STREET_TYPES:
            continue
        parts.append(part)
    name = " ".join(parts).strip()
    house = norm_housenumber(right)
    if not name or not house:
        return None
    return name, house


def gis_keys(item: dict) -> list[str]:
    addr = item.get("address") or {}
    house_obj = addr.get("house") or {}
    street_obj = addr.get("street") or {}
    number = house_obj.get("houseNumber") or ""
    building = house_obj.get("buildingNumber")
    if building:
        number = f"{number}к{building}" if number else str(building)
    street_name = street_obj.get("formalName") or street_obj.get("offName") or ""
    keys = []
    if street_name and number:
        keys.append(f"{norm_text(street_name)}|{norm_housenumber(number)}")
    fmt = addr.get("formattedAddress") or ""
    match = re.search(
        r"(?:ул|улица|пр-кт|проспект|пер|переулок|б-р|бульвар|пл|площадь|ш|шоссе|"
        r"наб|проезд|тракт)\.?\s+([^,]+),\s*д\.?\s*([0-9A-Za-zА-Яа-я/-]+)",
        fmt,
        flags=re.I,
    )
    if match:
        keys.append(f"{norm_text(match.group(1))}|{norm_housenumber(match.group(2))}")
    return list(dict.fromkeys(keys))


def enrich(houses: list[dict]) -> None:
    index: dict[str, list[tuple[int, str]]] = {}
    for house in houses:
        city = ((house.get("address") or {}).get("city") or {}).get("formalName") or ""
        # Prefer city of Yekaterinburg; still index others but mark fmt
        floors_raw = house.get("maxFloorCount")
        try:
            floors = (
                int(str(floors_raw).strip()) if floors_raw not in (None, "") else None
            )
        except ValueError:
            floors = None
        if not floors:
            continue
        fmt = (house.get("address") or {}).get("formattedAddress") or ""
        # Skip obvious non-city settlements in formatted address when city isn't Ekb
        if city and city != "Екатеринбург":
            continue
        if re.search(r",\s*п\s+\S+", fmt) and "г Екатеринбург" in fmt:
            # e.g. city Ekb but settlement village in address — skip to reduce false matches
            if ", п " in fmt or ", пгт " in fmt:
                continue
        for key in gis_keys(house):
            index.setdefault(key, []).append((floors, fmt))

    payload = json.loads(BUILDINGS.read_text(encoding="utf-8"))
    buildings = payload["buildings"]
    stats = {
        "matched": 0,
        "height_updated": 0,
        "ambiguous": 0,
        "no_address": 0,
        "no_match": 0,
        "kept": 0,
    }
    samples = []

    for building in buildings:
        address = building.get("address")
        if not address:
            stats["no_address"] += 1
            continue
        parsed = parse_osm_address(address)
        if not parsed:
            stats["no_match"] += 1
            continue
        name, house_no = parsed
        cands = index.get(f"{name}|{house_no}", [])
        if not cands:
            stats["no_match"] += 1
            continue
        floors_vals = sorted({floors for floors, _ in cands})
        if len(floors_vals) > 1:
            stats["ambiguous"] += 1
            floors = max(floors_vals)
        else:
            stats["matched"] += 1
            floors = floors_vals[0]
        new_height = float(floors) * METERS_PER_LEVEL
        old_height = float(building.get("height") or 0)
        if old_height <= 3.05 or new_height > old_height + 0.05:
            if abs(old_height - new_height) > 0.05:
                building["height"] = new_height
                stats["height_updated"] += 1
                if len(samples) < 12:
                    samples.append(
                        (address, old_height, new_height, floors, cands[0][1])
                    )
            else:
                stats["kept"] += 1
        else:
            stats["kept"] += 1

    BUILDINGS.write_text(
        json.dumps({"buildings": buildings}, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    height3 = sum(
        1
        for building in buildings
        if abs(float(building.get("height") or 0) - 3) < 0.05
    )
    print("stats", stats, flush=True)
    print("samples:", flush=True)
    for sample in samples:
        print(" ", sample, flush=True)
    print(f"after height==3: {height3}/{len(buildings)}", flush=True)
    print("written", BUILDINGS, flush=True)


def main() -> None:
    print(f"auth from {AUTH_SOURCE}", flush=True)
    print(f"session={SESSION}", flush=True)
    houses = download_all()
    enrich(houses)


if __name__ == "__main__":
    main()
