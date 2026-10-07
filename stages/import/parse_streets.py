import json
import math
import sys
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional, Tuple

EARTH_RADIUS = 6378137  # Earth's radius in meters
CELL_SIZE_METERS = 100.0

# OSM highway values that represent drawable road geometry (ways, not POI nodes)
# Vehicle / named urban streets. Excludes service (driveways, parking aisles),
# footway/path/steps/cycleway — those are not useful for street visibility chunks.
ROAD_HIGHWAYS = {
    "primary",
    "secondary",
    "tertiary",
    "residential",
    "unclassified",
    "living_street",
    "primary_link",
    "secondary_link",
    "tertiary_link",
    "pedestrian",
    "road",
    "trunk",
    "trunk_link",
    "motorway",
    "motorway_link",
}

# Approximate carriageway widths (meters) when width/lanes tags are absent
DEFAULT_WIDTHS = {
    "motorway": 20.0,
    "motorway_link": 8.0,
    "trunk": 16.0,
    "trunk_link": 8.0,
    "primary": 14.0,
    "primary_link": 8.0,
    "secondary": 12.0,
    "secondary_link": 7.0,
    "tertiary": 10.0,
    "tertiary_link": 6.0,
    "residential": 7.0,
    "living_street": 6.0,
    "unclassified": 7.0,
    "service": 4.0,
    "pedestrian": 5.0,
    "road": 7.0,
}

LANE_WIDTH_METERS = 3.5
MIN_SEGMENT_LENGTH = 1e-6


def lat_lng_to_mercator(lat: float, lng: float):
    lat_rad = math.radians(lat)
    lng_rad = math.radians(lng)
    x = EARTH_RADIUS * lng_rad
    z = EARTH_RADIUS * math.log(math.tan(math.pi / 4 + lat_rad / 2))
    return {"x": x, "z": z}


def lat_lng_to_linear(lat: float, lng: float, bounds: Dict[str, float]):
    minlat = bounds["minlat"]
    maxlat = bounds["maxlat"]
    minlon = bounds["minlon"]
    maxlon = bounds["maxlon"]

    normalized_x = (lng - minlon) / (maxlon - minlon)
    normalized_z = (lat - minlat) / (maxlat - minlat)

    x = normalized_x * 1000
    z = normalized_z * 1000
    return {"x": x, "z": z}


def transform_coordinates(
    lat: float, lng: float, translation_type: str, bounds: Dict[str, float]
):
    if translation_type == "none":
        return {"x": lng, "z": lat}
    elif translation_type == "mercator":
        return lat_lng_to_mercator(lat, lng)
    elif translation_type == "linear":
        return lat_lng_to_linear(lat, lng, bounds)
    else:
        return lat_lng_to_linear(lat, lng, bounds)


def parse_street_tags(element) -> Dict:
    result = {}
    for tag in element.findall("tag"):
        k = tag.get("k")
        v = tag.get("v")
        if k == "highway":
            result["highway"] = v
        elif k == "name":
            result["name"] = v
        elif k == "width":
            try:
                # OSM width may be "7", "7 m", "7.5"
                result["width"] = float(str(v).split()[0].replace(",", "."))
            except (ValueError, TypeError, IndexError):
                pass
        elif k == "lanes":
            try:
                result["lanes"] = float(str(v).split(";")[0].strip())
            except (ValueError, TypeError, IndexError):
                pass
    return result


def resolve_width(tags: Dict) -> float:
    if "width" in tags:
        return max(tags["width"], 1.0)
    if "lanes" in tags:
        return max(tags["lanes"] * LANE_WIDTH_METERS, 1.0)
    highway = tags.get("highway", "road")
    return DEFAULT_WIDTHS.get(highway, 6.0)


def point_cell(x: float, z: float, cell_size: float) -> Tuple[int, int]:
    return (math.floor(x / cell_size), math.floor(z / cell_size))


def clip_segment_to_aabb(
    p1: Dict[str, float],
    p2: Dict[str, float],
    xmin: float,
    xmax: float,
    zmin: float,
    zmax: float,
) -> Optional[Tuple[Dict[str, float], Dict[str, float]]]:
    """Liang–Barsky line clipping against an axis-aligned box."""
    x0, z0 = p1["x"], p1["z"]
    x1, z1 = p2["x"], p2["z"]
    dx = x1 - x0
    dz = z1 - z0
    t0, t1 = 0.0, 1.0

    checks = (
        (-dx, x0 - xmin),
        (dx, xmax - x0),
        (-dz, z0 - zmin),
        (dz, zmax - z0),
    )

    for p, q in checks:
        if abs(p) < 1e-15:
            if q < 0:
                return None
            continue
        r = q / p
        if p < 0:
            if r > t1:
                return None
            if r > t0:
                t0 = r
        else:
            if r < t0:
                return None
            if r < t1:
                t1 = r

    return (
        {"x": x0 + t0 * dx, "z": z0 + t0 * dz},
        {"x": x0 + t1 * dx, "z": z0 + t1 * dz},
    )


def cells_crossed_by_segment(
    p1: Dict[str, float], p2: Dict[str, float], cell_size: float
) -> List[Tuple[int, int]]:
    """Return all grid cells that a segment touches (inclusive)."""
    x0, z0 = p1["x"], p1["z"]
    x1, z1 = p2["x"], p2["z"]
    cx0, cz0 = point_cell(x0, z0, cell_size)
    cx1, cz1 = point_cell(x1, z1, cell_size)

    cells = set()
    # Walk a dense set of samples plus endpoints; for 100m cells and city-scale
    # segments this is enough and avoids a full grid-traversal implementation.
    dx = x1 - x0
    dz = z1 - z0
    length = math.hypot(dx, dz)
    steps = max(int(length / (cell_size * 0.25)) + 1, 1)
    for i in range(steps + 1):
        t = i / steps
        x = x0 + t * dx
        z = z0 + t * dz
        cells.add(point_cell(x, z, cell_size))

    # Also include all cells in the bounding integer range (cheap for short spans)
    for cx in range(min(cx0, cx1), max(cx0, cx1) + 1):
        for cz in range(min(cz0, cz1), max(cz0, cz1) + 1):
            xmin = cx * cell_size
            xmax = (cx + 1) * cell_size
            zmin = cz * cell_size
            zmax = (cz + 1) * cell_size
            if clip_segment_to_aabb(p1, p2, xmin, xmax, zmin, zmax) is not None:
                cells.add((cx, cz))

    return sorted(cells)


def almost_equal(a: Dict[str, float], b: Dict[str, float], eps: float = 1e-6) -> bool:
    return abs(a["x"] - b["x"]) < eps and abs(a["z"] - b["z"]) < eps


def split_polyline_by_grid(
    nodes: List[Dict[str, float]], cell_size: float
) -> Dict[Tuple[int, int], List[List[Dict[str, float]]]]:
    """
    Split a polyline into per-cell polylines.

    Returns mapping cell -> list of polylines (usually one continuous chain).
    """
    cell_chains: Dict[Tuple[int, int], List[List[Dict[str, float]]]] = {}

    def append_segment(cell: Tuple[int, int], a: Dict[str, float], b: Dict[str, float]):
        if almost_equal(a, b):
            return
        chains = cell_chains.setdefault(cell, [])
        if chains and almost_equal(chains[-1][-1], a):
            chains[-1].append(b)
        else:
            chains.append([a, b])

    for i in range(len(nodes) - 1):
        p1 = nodes[i]
        p2 = nodes[i + 1]
        if almost_equal(p1, p2):
            continue
        for cx, cz in cells_crossed_by_segment(p1, p2, cell_size):
            xmin = cx * cell_size
            xmax = (cx + 1) * cell_size
            zmin = cz * cell_size
            zmax = (cz + 1) * cell_size
            clipped = clip_segment_to_aabb(p1, p2, xmin, xmax, zmin, zmax)
            if clipped is None:
                continue
            a, b = clipped
            append_segment((cx, cz), a, b)

    return cell_chains


def _normalize(dx: float, dz: float) -> Optional[Tuple[float, float]]:
    length = math.hypot(dx, dz)
    if length < MIN_SEGMENT_LENGTH:
        return None
    return (dx / length, dz / length)


def polyline_to_strip_polygon(
    nodes: List[Dict[str, float]], half_width: float
) -> Optional[List[Dict[str, float]]]:
    """Build a closed strip polygon around a centerline polyline."""
    if len(nodes) < 2 or half_width <= 0:
        return None

    left: List[Dict[str, float]] = []
    right: List[Dict[str, float]] = []

    for i, node in enumerate(nodes):
        if i == 0:
            direction = _normalize(nodes[1]["x"] - node["x"], nodes[1]["z"] - node["z"])
        elif i == len(nodes) - 1:
            direction = _normalize(
                node["x"] - nodes[i - 1]["x"], node["z"] - nodes[i - 1]["z"]
            )
        else:
            d1 = _normalize(node["x"] - nodes[i - 1]["x"], node["z"] - nodes[i - 1]["z"])
            d2 = _normalize(nodes[i + 1]["x"] - node["x"], nodes[i + 1]["z"] - node["z"])
            if d1 and d2:
                direction = _normalize(d1[0] + d2[0], d1[1] + d2[1])
                if direction is None:
                    direction = d2
            else:
                direction = d1 or d2

        if direction is None:
            continue

        nx, nz = -direction[1], direction[0]  # left normal
        left.append(
            {"x": node["x"] + nx * half_width, "z": node["z"] + nz * half_width}
        )
        right.append(
            {"x": node["x"] - nx * half_width, "z": node["z"] - nz * half_width}
        )

    if len(left) < 2 or len(right) < 2:
        return None

    polygon = left + list(reversed(right))
    # Close polygon explicitly (matches building node rings that often repeat first point)
    if not almost_equal(polygon[0], polygon[-1]):
        polygon.append({"x": polygon[0]["x"], "z": polygon[0]["z"]})
    return polygon


def way_nodes(
    way,
    nodes_dict: Dict[str, Dict[str, float]],
    translation_type: str,
    bounds: Dict[str, float],
) -> List[Dict[str, float]]:
    nodes = []
    for nd in way.findall("nd"):
        ref = nd.get("ref")
        if ref and ref in nodes_dict:
            node_data = nodes_dict[ref]
            xz = transform_coordinates(
                node_data["lat"], node_data["lon"], translation_type, bounds
            )
            # Invert X to match parse_buildings mirroring fix
            xz["x"] = -xz["x"]
            if nodes and almost_equal(nodes[-1], xz):
                continue
            nodes.append(xz)
    return nodes


def parse_streets(
    xml_file_path: str,
    output_file_path: str,
    translation_type: str,
    cell_size: float = CELL_SIZE_METERS,
) -> None:
    try:
        tree = ET.parse(xml_file_path)
        root = tree.getroot()
    except ET.ParseError as e:
        print(f"Error parsing XML file: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"XML file not found: {xml_file_path}")
        sys.exit(1)

    bounds_element = root.find("bounds")
    if bounds_element is None:
        print("Error: No bounds element found in XML")
        sys.exit(1)

    bounds = {
        "minlat": float(bounds_element.get("minlat", 0)),
        "maxlat": float(bounds_element.get("maxlat", 0)),
        "minlon": float(bounds_element.get("minlon", 0)),
        "maxlon": float(bounds_element.get("maxlon", 0)),
    }

    print(
        f"Map bounds: minlat={bounds['minlat']}, maxlat={bounds['maxlat']}, "
        f"minlon={bounds['minlon']}, maxlon={bounds['maxlon']}"
    )
    print(f"Using translation type: {translation_type}")
    print(f"Street cell size: {cell_size} m")

    print("Collecting nodes...")
    nodes_dict = {}
    for node in root.findall("node"):
        node_id = node.get("id")
        if node_id:
            nodes_dict[node_id] = {
                "lat": float(node.get("lat", 0)),
                "lon": float(node.get("lon", 0)),
            }
    print(f"Collected {len(nodes_dict)} nodes")

    streets = []
    ways_processed = 0
    ways_skipped = 0

    print("Processing street ways...")
    for way in root.findall("way"):
        way_id = way.get("id")
        if not way_id:
            continue

        tags = parse_street_tags(way)
        highway = tags.get("highway")
        if highway not in ROAD_HIGHWAYS:
            continue

        nodes = way_nodes(way, nodes_dict, translation_type, bounds)
        if len(nodes) < 2:
            ways_skipped += 1
            continue

        width = resolve_width(tags)
        half_width = width / 2.0
        name = tags.get("name")
        cell_chains = split_polyline_by_grid(nodes, cell_size)

        piece_index = 0
        for (cx, cz), chains in cell_chains.items():
            for chain in chains:
                if len(chain) < 2:
                    continue
                polygon = polyline_to_strip_polygon(chain, half_width)
                if polygon is None:
                    continue

                street_obj = {
                    "id": f"{way_id}_{cx}_{cz}_{piece_index}",
                    "way_id": way_id,
                    "name": name,
                    "highway": highway,
                    "width": width,
                    "cell": {"cx": cx, "cz": cz},
                    "nodes": polygon,
                }
                streets.append(street_obj)
                piece_index += 1

        ways_processed += 1

    print(f"Processed {ways_processed} street ways ({ways_skipped} skipped)")
    print(f"Created {len(streets)} street cell polygons")

    output_data = {
        "cell_size": cell_size,
        "streets": streets,
    }

    try:
        with open(output_file_path, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"Street data saved to {output_file_path}")
    except IOError as e:
        print(f"Error writing JSON file: {e}")
        sys.exit(1)


def main():
    input_file = "stages/import/map_data.xml"
    output_file = "stages/import/streets.json"

    try:
        with open("stages/import/input.json", "r", encoding="utf-8") as f:
            input_config = json.load(f)
        translation_type = input_config.get("translation", "linear")
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading input.json: {e}")
        translation_type = "linear"

    print(f"Parsing streets from {input_file}...")
    parse_streets(input_file, output_file, translation_type)


if __name__ == "__main__":
    main()
