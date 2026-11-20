#!/usr/bin/env python3
"""Reverse-geocode addressless buildings via Yandex, enrich address (+ floors from DomGIS)."""
from __future__ import annotations

import argparse
import json
import math
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BUILDINGS_PATH = ROOT / "buildings.json"
HOUSES_PATH = ROOT / "domgis_houses.json"
CACHE_PATH = ROOT / "yandex_geocode_cache.json"
CURL_PATH = ROOT / "check.curl"
ITC_ADDRESS_NAME = "чкалова"
ITC_HOUSE = "3"

EARTH_RADIUS = 6378137.0
METERS_PER_LEVEL = 3.0
DEFAULT_LIMIT = 900
DEFAULT_REFERER = "https://localhost/"
SLEEP = 0.3

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


def inv_mercator(x: float, z: float) -> tuple[float, float]:
    lng = math.degrees(-x / EARTH_RADIUS)
    lat = math.degrees(2 * math.atan(math.exp(z / EARTH_RADIUS)) - math.pi / 2)
    return lat, lng


def centroid(nodes: list[dict]) -> tuple[float, float]:
    return (
        sum(n["x"] for n in nodes) / len(nodes),
        sum(n["z"] for n in nodes) / len(nodes),
    )


def norm_text(value: str) -> str:
    value = (value or "").lower().replace("ё", "е")
    value = value.replace("«", "").replace("»", "").replace('"', "")
    value = re.sub(r"[.,;]", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def norm_housenumber(value: str) -> str:
    value = norm_text(value).replace(" ", "")
    return value.replace("корпус", "к").replace("корп", "к")


def parse_osm_address(address: str) -> tuple[str, str] | None:
    if not address:
        return None
    text = re.sub(r"^г\.?\s*екатеринбург,?\s*", "", address.strip(), flags=re.I)
    if "," not in text:
        return None
    left, right = text.rsplit(",", 1)
    parts = [p for p in norm_text(left).split() if p.rstrip(".") not in STREET_TYPES]
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
    keys: list[str] = []
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


def load_apikey(explicit: str | None) -> str:
    if explicit:
        return explicit.strip()
    env = __import__("os").environ.get("YANDEX_GEOCODER_APIKEY")
    if env:
        return env.strip()
    if CURL_PATH.exists():
        text = CURL_PATH.read_text(encoding="utf-8")
        match = re.search(r"apikey=([0-9a-fA-F-]{36})", text)
        if match:
            return match.group(1)
    raise SystemExit(
        "No API key: set YANDEX_GEOCODER_APIKEY, pass --apikey, or keep check.curl"
    )


def load_cache() -> dict:
    if not CACHE_PATH.exists():
        return {"queried": {}}
    return json.loads(CACHE_PATH.read_text(encoding="utf-8"))


def save_cache(cache: dict) -> None:
    CACHE_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def build_gis_index(houses: list[dict]) -> dict[str, list[tuple[int, str]]]:
    index: dict[str, list[tuple[int, str]]] = {}
    for house in houses:
        city = ((house.get("address") or {}).get("city") or {}).get("formalName") or ""
        if city and city != "Екатеринбург":
            continue
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
        for key in gis_keys(house):
            index.setdefault(key, []).append((floors, fmt))
    return index


def find_itc_center(buildings: list[dict]) -> tuple[float, float]:
    candidates = []
    for building in buildings:
        parsed = parse_osm_address(building.get("address") or "")
        if (
            parsed
            and parsed[0] == ITC_ADDRESS_NAME
            and parsed[1] == ITC_HOUSE
            and building.get("nodes")
        ):
            candidates.append(building)
    if not candidates:
        raise SystemExit("ITC building (Чкалова, 3) not found")
    itc = max(candidates, key=lambda b: float(b.get("height") or 0))
    return centroid(itc["nodes"])


def yandex_reverse(
    apikey: str, referer: str, lat: float, lng: float
) -> dict:
    params = {
        "apikey": apikey,
        "geocode": f"{lng},{lat}",
        "kind": "house",
        "lang": "ru_RU",
        "format": "json",
        "results": 1,
    }
    url = "https://geocode-maps.yandex.ru/v1/?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "maps.ai-yandex-enrich/0.1",
            "Referer": referer,
        },
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.loads(resp.read().decode())
    members = (
        data.get("response", {})
        .get("GeoObjectCollection", {})
        .get("featureMember", [])
    )
    if not members:
        return {
            "text": None,
            "kind": None,
            "precision": None,
            "street": None,
            "house": None,
        }
    obj = members[0]["GeoObject"]
    meta = obj.get("metaDataProperty", {}).get("GeocoderMetaData", {})
    address = meta.get("Address", {}) or {}
    comps: dict[str, str] = {}
    for component in address.get("Components") or []:
        kind = component.get("kind")
        name = component.get("name")
        if kind and name and kind not in comps:
            comps[kind] = name
    return {
        "text": meta.get("text") or address.get("formatted"),
        "kind": meta.get("kind"),
        "precision": meta.get("precision"),
        "street": comps.get("street"),
        "house": comps.get("house"),
    }


def is_real_house_address(
    kind: str | None, street: str | None, house: str | None, precision: str | None = None
) -> bool:
    """Yandex sometimes returns street-only toponyms (e.g. «переулок Базовый»).

    Accept only house-level hits with a street and a housenumber that contains a digit.
    """
    if kind and kind != "house":
        return False
    if precision and precision not in ("exact", "number", "near"):
        return False
    if not street or not house:
        return False
    if not re.search(r"\d", house):
        return False
    return True


def proposed_address(
    street: str | None,
    house: str | None,
    *,
    kind: str | None = None,
    precision: str | None = None,
) -> str | None:
    if not is_real_house_address(kind, street, house, precision):
        return None
    return f"{street.strip()}, {house.strip()}"


def lookup_floors(
    index: dict[str, list[tuple[int, str]]], address: str
) -> tuple[int, str] | None:
    parsed = parse_osm_address(address)
    if not parsed:
        return None
    cands = index.get(f"{parsed[0]}|{parsed[1]}", [])
    if not cands:
        return None
    floors = max(f for f, _ in cands)
    return floors, cands[0][1]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=DEFAULT_LIMIT)
    parser.add_argument("--apikey")
    parser.add_argument("--referer", default=DEFAULT_REFERER)
    parser.add_argument("--sleep", type=float, default=SLEEP)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    apikey = load_apikey(args.apikey)
    cache = load_cache()
    queried: dict = cache.setdefault("queried", {})

    print("load buildings...", flush=True)
    payload = json.loads(BUILDINGS_PATH.read_text(encoding="utf-8"))
    buildings: list[dict] = payload["buildings"]
    by_id = {str(b["id"]): b for b in buildings}

    total_no_address = sum(1 for b in buildings if not b.get("address"))
    if "initial_addressless" not in cache:
        # baseline once: current addressless + already filled by this tool
        cache["initial_addressless"] = total_no_address + sum(
            1
            for bid, entry in queried.items()
            if entry.get("applied_address") and bid in by_id
        )
        if cache["initial_addressless"] < total_no_address:
            cache["initial_addressless"] = total_no_address
        save_cache(cache)
    initial_pool = int(cache["initial_addressless"])

    # candidates: no address, has nodes, not yet queried
    cx, cz = find_itc_center(buildings)
    candidates: list[tuple[float, dict, float, float, float, float]] = []
    for building in buildings:
        if building.get("address"):
            continue
        bid = str(building["id"])
        if bid in queried:
            continue
        nodes = building.get("nodes") or []
        if len(nodes) < 3:
            continue
        x, z = centroid(nodes)
        lat, lng = inv_mercator(x, z)
        dist = math.hypot(x - cx, z - cz)
        candidates.append((dist, building, x, z, lat, lng))
    candidates.sort(key=lambda t: t[0])
    batch = candidates[: max(0, args.limit)]

    print(
        f"no_address={total_no_address} cached_queried={len(queried)} "
        f"remaining_unqueried={len(candidates)} batch={len(batch)}",
        flush=True,
    )
    if not batch:
        print("nothing to do", flush=True)
        return

    print("load domgis...", flush=True)
    houses = json.loads(HOUSES_PATH.read_text(encoding="utf-8"))
    gis_index = build_gis_index(houses)
    print(f"gis keys={len(gis_index)}", flush=True)

    stats = {
        "queried": 0,
        "address_set": 0,
        "floors_set": 0,
        "errors": 0,
        "no_house": 0,
        "rejected_not_house": 0,
    }
    now = datetime.now(timezone.utc).isoformat()

    for idx, (dist, building, _x, _z, lat, lng) in enumerate(batch, 1):
        bid = str(building["id"])
        try:
            rev = yandex_reverse(apikey, args.referer, lat, lng)
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")[:200]
            print(f"[{idx}/{len(batch)}] id={bid} HTTP {exc.code}: {body}", flush=True)
            stats["errors"] += 1
            # do not mark as queried on auth/rate errors — allow retry
            if exc.code in (401, 403, 429):
                break
            time.sleep(args.sleep)
            continue
        except Exception as exc:  # noqa: BLE001
            print(f"[{idx}/{len(batch)}] id={bid} error: {exc}", flush=True)
            stats["errors"] += 1
            time.sleep(args.sleep)
            continue

        addr = proposed_address(
            rev.get("street"),
            rev.get("house"),
            kind=rev.get("kind"),
            precision=rev.get("precision"),
        )
        floors_info = lookup_floors(gis_index, addr) if addr else None
        entry = {
            "queried_at": now,
            "d_itc": round(dist, 1),
            "lat": lat,
            "lng": lng,
            "yandex": rev,
            "proposed_address": addr,
            "gis_floors": floors_info[0] if floors_info else None,
            "gis_address": floors_info[1] if floors_info else None,
            "applied_address": False,
            "applied_height": False,
        }

        if addr and not args.dry_run:
            building["address"] = addr
            entry["applied_address"] = True
            stats["address_set"] += 1
        elif not addr:
            stats["no_house"] += 1
            # street-only / non-house toponym — counted separately when obvious
            if rev.get("street") and not rev.get("house"):
                stats["rejected_not_house"] += 1
            elif rev.get("kind") and rev.get("kind") != "house":
                stats["rejected_not_house"] += 1

        if floors_info and not args.dry_run:
            floors, _fmt = floors_info
            new_height = float(floors) * METERS_PER_LEVEL
            old_height = float(building.get("height") or 0)
            if old_height <= 3.05 or new_height > old_height + 0.05:
                if abs(old_height - new_height) > 0.05:
                    building["height"] = new_height
                    entry["applied_height"] = True
                    stats["floors_set"] += 1

        queried[bid] = entry
        stats["queried"] += 1

        if idx % 25 == 0 or idx == len(batch):
            if not args.dry_run:
                save_cache(cache)
                BUILDINGS_PATH.write_text(
                    json.dumps(
                        {"buildings": buildings},
                        ensure_ascii=False,
                        separators=(",", ":"),
                    ),
                    encoding="utf-8",
                )
            print(
                f"[{idx}/{len(batch)}] addr={stats['address_set']} "
                f"floors={stats['floors_set']} errors={stats['errors']}",
                flush=True,
            )

        time.sleep(args.sleep)

    if not args.dry_run:
        save_cache(cache)
        BUILDINGS_PATH.write_text(
            json.dumps(
                {"buildings": buildings}, ensure_ascii=False, separators=(",", ":")
            ),
            encoding="utf-8",
        )

    still_no_address = sum(1 for b in buildings if not b.get("address"))
    filled_this_run = total_no_address - still_no_address
    queried_total = len(queried)
    with_address_from_cache = sum(
        1 for entry in queried.values() if entry.get("applied_address")
    )
    remaining_unqueried = sum(
        1
        for b in buildings
        if not b.get("address") and str(b["id"]) not in queried
    )
    pct_queried = 100.0 * queried_total / initial_pool if initial_pool else 100.0
    pct_addresses = (
        100.0 * with_address_from_cache / initial_pool if initial_pool else 100.0
    )

    print("\n=== STATS ===", flush=True)
    print(f"this_run_queried:     {stats['queried']}", flush=True)
    print(f"this_run_got_address: {stats['address_set']}", flush=True)
    print(f"this_run_got_floors:  {stats['floors_set']}", flush=True)
    print(f"this_run_no_house:    {stats['no_house']}", flush=True)
    print(f"this_run_rejected_not_house: {stats['rejected_not_house']}", flush=True)
    print(f"this_run_errors:      {stats['errors']}", flush=True)
    print(f"cache_queried_total:  {queried_total}", flush=True)
    print(
        f"buildings_no_address: {still_no_address} "
        f"(before this run {total_no_address}, filled {filled_this_run})",
        flush=True,
    )
    print(
        f"progress_queried:     {pct_queried:.2f}% "
        f"({queried_total}/{initial_pool} of initial addressless pool)",
        flush=True,
    )
    print(
        f"progress_addresses:   {pct_addresses:.2f}% "
        f"({with_address_from_cache}/{initial_pool} got address via this tool)",
        flush=True,
    )
    print(f"remaining_unqueried:  {remaining_unqueried}", flush=True)
    print(f"cache: {CACHE_PATH}", flush=True)
    print(f"buildings: {BUILDINGS_PATH}", flush=True)


if __name__ == "__main__":
    main()
