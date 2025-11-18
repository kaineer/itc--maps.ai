import json
import math
import sys
import xml.etree.ElementTree as ET
from typing import Any, Dict, List


def lat_lng_to_mercator(lat: float, lng: float) -> List[float]:
    """
    Convert latitude and longitude to Mercator projection coordinates.

    Args:
        lat: Latitude coordinate in degrees
        lng: Longitude coordinate in degrees

    Returns:
        Dict {"x": x, "z": z} coordinates in Mercator projection
    """
    # Convert to radians
    lat_rad = math.radians(lat)
    lng_rad = math.radians(lng)

    # Mercator projection formulas
    x = lng_rad
    z = math.log(math.tan(math.pi / 4 + lat_rad / 2))

    return {"x": x, "z": z}


def lat_lng_to_linear(lat: float, lng: float, bounds: Dict[str, float]) -> List[float]:
    """
    Convert latitude and longitude to linear normalized coordinates.

    Args:
        lat: Latitude coordinate
        lng: Longitude coordinate
        bounds: Dictionary with minlat, maxlat, minlon, maxlon from XML bounds

    Returns:
        Dict {"x": x, "z": z} coordinates normalized to 0-1000 range
    """
    minlat = bounds["minlat"]
    maxlat = bounds["maxlat"]
    minlon = bounds["minlon"]
    maxlon = bounds["maxlon"]

    # Normalize coordinates to 0-1 range
    normalized_x = (lng - minlon) / (maxlon - minlon)
    normalized_z = (lat - minlat) / (maxlat - minlat)

    # Scale to reasonable values
    x = normalized_x * 1000
    z = normalized_z * 1000

    return {"x": x, "z": z}


def transform_coordinates(
    lat: float, lng: float, translation_type: str, bounds: Dict[str, float]
) -> List[float]:
    """
    Transform coordinates based on translation type.

    Args:
        lat: Latitude coordinate
        lng: Longitude coordinate
        translation_type: Type of transformation ("none", "mercator", "linear")
        bounds: Dictionary with bounds for linear transformation

    Returns:
        Dict {"x": x, "z": z} transformed coordinates
    """
    if translation_type == "none":
        return {"x": lng, "z": lat}  # Keep as lat/lng
    elif translation_type == "mercator":
        return lat_lng_to_mercator(lat, lng)
    elif translation_type == "linear":
        return lat_lng_to_linear(lat, lng, bounds)
    else:
        # Default to linear if unknown type
        return lat_lng_to_linear(lat, lng, bounds)


def parse_buildings(
    xml_file_path: str, output_file_path: str, itc_file_path: str, translation_type: str
) -> None:
    """
    Parse OpenStreetMap XML data and extract building information.

    Args:
        xml_file_path: Path to the input XML file
        output_file_path: Path to the output JSON file
        itc_file_path: Path to the ITC coordinates JSON file
        translation_type: Type of coordinate transformation
    """

    # Parse the XML file
    try:
        tree = ET.parse(xml_file_path)
        root = tree.getroot()
    except ET.ParseError as e:
        print(f"Error parsing XML file: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"XML file not found: {xml_file_path}")
        sys.exit(1)

    # Get bounds from XML for coordinate transformation
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

    # Create dictionaries to store nodes and ways
    nodes_dict = {}
    buildings = []
    itc_building = None

    # First pass: collect all nodes
    print("Collecting nodes...")
    for node in root.findall("node"):
        node_id = node.get("id")
        if node_id:
            nodes_dict[node_id] = {
                "lat": float(node.get("lat", 0)),
                "lon": float(node.get("lon", 0)),
            }

    print(f"Collected {len(nodes_dict)} nodes")

    # Second pass: process ways that are buildings
    print("Processing building ways...")
    for way in root.findall("way"):
        way_id = way.get("id")
        if not way_id:
            continue

        # Check if this way is a building
        is_building = False
        street = None
        housenumber = None
        height = None
        building_levels = None

        # Check tags for building information
        for tag in way.findall("tag"):
            k = tag.get("k")
            v = tag.get("v")

            if k == "building":
                is_building = True
            elif k == "addr:street":
                street = v
            elif k == "addr:housenumber":
                housenumber = v
            elif k == "height":
                try:
                    height = float(v)
                except (ValueError, TypeError):
                    pass
            elif k == "building:levels":
                try:
                    building_levels = float(v)
                except (ValueError, TypeError):
                    pass

        # If it's a building, process it
        if is_building:
            # Get all node coordinates for this way
            nodes = []
            for nd in way.findall("nd"):
                ref = nd.get("ref")
                if ref and ref in nodes_dict:
                    node_data = nodes_dict[ref]
                    # Transform coordinates based on translation type
                    xz_coords = transform_coordinates(
                        node_data["lat"], node_data["lon"], translation_type, bounds
                    )
                    # Invert X coordinate to fix mirroring issue
                    xz_coords["x"] = -xz_coords["x"]
                    nodes.append(xz_coords)

            # Build address string
            address_parts = []
            if street:
                address_parts.append(street)
            if housenumber:
                address_parts.append(housenumber)
            address = ", ".join(address_parts) if address_parts else None

            # Calculate height
            if height is not None:
                # Use direct height value if available
                final_height = height
            elif building_levels is not None:
                # Calculate height from building levels (3 meters per floor)
                final_height = building_levels * 3
            else:
                # Default height of 3 meters
                final_height = 3

            # Create building object
            building_obj = {
                "id": way_id,
                "nodes": nodes,
                "address": address,
                "height": final_height,
            }

            buildings.append(building_obj)

            # Check if this is the ITC building (Чкалова, 3)
            if address and "Чкалова" in address and housenumber == "3":
                itc_building = building_obj
                print(f"Found ITC building: {address}")

    print(f"Found {len(buildings)} buildings")

    # Save buildings to JSON file
    output_data = {"buildings": buildings}

    try:
        with open(output_file_path, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"Building data saved to {output_file_path}")
    except IOError as e:
        print(f"Error writing JSON file: {e}")
        sys.exit(1)

    # Save ITC coordinates if found
    if itc_building:
        # Calculate center coordinates (average of all nodes)
        nodes = itc_building["nodes"]
        if nodes:
            center_x = sum(node["x"] for node in nodes) / len(nodes)
            center_z = sum(node["z"] for node in nodes) / len(nodes)
            # Note: X coordinate is already inverted at import level

            itc_data = {"center": {"x": center_x, "z": center_z}}

            try:
                with open(itc_file_path, "w", encoding="utf-8") as f:
                    json.dump(itc_data, f, indent=2, ensure_ascii=False)
                print(f"ITC coordinates saved to {itc_file_path}")
                print(f"ITC center coordinates: [{center_x:.2f}, {center_z:.2f}]")
            except IOError as e:
                print(f"Error writing ITC JSON file: {e}")
        else:
            print("Warning: ITC building has no nodes, cannot calculate center")
    else:
        print("Warning: ITC building (Чкалова, 3) not found")


def main():
    """Main function to run the building parser."""
    input_file = "stages/import/map_data.xml"
    output_file = "stages/import/buildings.json"
    itc_file = "stages/import/itc.json"

    # Read translation type from input.json
    try:
        with open("stages/import/input.json", "r", encoding="utf-8") as f:
            input_config = json.load(f)
        translation_type = input_config.get("translation", "linear")
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading input.json: {e}")
        translation_type = "linear"

    print(f"Parsing buildings from {input_file}...")
    parse_buildings(input_file, output_file, itc_file, translation_type)


if __name__ == "__main__":
    main()
