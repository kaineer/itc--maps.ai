import json
import random
from pathlib import Path


def generate_buildings_visualization():
    """Generate HTML with SVG visualization of imported buildings."""

    # Path to buildings data
    buildings_path = Path(__file__).parent.parent / "import" / "buildings.json"

    # Read buildings data
    try:
        with open(buildings_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        buildings = data.get("buildings", [])
        print(f"Loaded {len(buildings)} buildings")
    except Exception as e:
        print(f"Error reading buildings data: {e}")
        return

    if not buildings:
        print("No buildings found to visualize")
        return

    # Calculate overall bounds for SVG viewBox
    all_coords = []
    for building in buildings:
        for node in building.get("nodes", []):
            all_coords.append(node)

    if not all_coords:
        print("No coordinates found in buildings")
        return

    # Calculate bounds
    x_coords = [coord["x"] for coord in all_coords]
    z_coords = [coord["z"] for coord in all_coords]

    min_x, max_x = min(x_coords), max(x_coords)
    min_z, max_z = min(z_coords), max(z_coords)

    # Add some padding
    padding = 50
    view_box = f"{min_x - padding} {min_z - padding} {max_x - min_x + 2 * padding} {max_z - min_z + 2 * padding}"

    # Generate random colors for buildings
    colors = []
    for _ in range(len(buildings)):
        # Generate pleasant colors (avoid too dark/light)
        r = random.randint(50, 200)
        g = random.randint(50, 200)
        b = random.randint(50, 200)
        colors.append(f"rgb({r},{g},{b})")

    # Generate SVG polygons
    svg_polygons = []
    for i, building in enumerate(buildings):
        nodes = building.get("nodes", [])
        if len(nodes) < 3:  # Need at least 3 points for a polygon
            continue

        # Create polygon points string
        points = " ".join([f"{node['x']},{node['z']}" for node in nodes])

        # Get building info for tooltip
        address = building.get("address", "No address")
        height = building.get("height", "Unknown")
        building_id = building.get("id", "Unknown")

        polygon = f'''
        <polygon
            points="{points}"
            fill="{colors[i]}"
            fill-opacity="0.7"
            stroke="black"
            stroke-width="2"
            data-address="{address}"
            data-height="{height}"
            data-id="{building_id}"
            onmouseover="showBuildingInfo(this)"
            onmouseout="hideBuildingInfo()"
        />'''
        svg_polygons.append(polygon)

    # Generate HTML content
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buildings Visualization</title>
    <style>
        body {{
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        h1 {{
            text-align: center;
            color: #333;
            margin-bottom: 20px;
        }}
        .info-panel {{
            background: #e8f4fd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #2196F3;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        }}
        .stat-item {{
            background: white;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid #ddd;
        }}
        .building-info {{
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            display: none;
            max-width: 300px;
            z-index: 1000;
        }}
        svg {{
            border: 1px solid #ccc;
            background-color: #f8f8f8;
            width: 100%;
            height: 80vh;
        }}
        .legend {{
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Buildings Visualization</h1>

        <div class="info-panel">
            <h3>About this visualization:</h3>
            <p>This shows all imported buildings from OpenStreetMap data. Each building is represented as a colored polygon. Hover over any building to see its details.</p>
        </div>

        <div class="stats">
            <div class="stat-item">
                <strong>Total Buildings:</strong> {len(buildings)}
            </div>
            <div class="stat-item">
                <strong>Buildings with Address:</strong> {sum(1 for b in buildings if b.get("address"))}
            </div>
            <div class="stat-item">
                <strong>Coordinate Range X:</strong> {min_x:.1f} - {max_x:.1f}
            </div>
            <div class="stat-item">
                <strong>Coordinate Range Z:</strong> {min_z:.1f} - {max_z:.1f}
            </div>
        </div>

        <svg viewBox="{view_box}" preserveAspectRatio="xMidYMid meet">
            {"".join(svg_polygons)}
        </svg>

        <div class="legend">
            <p>Each color represents a different building. Buildings are randomly colored for better visual distinction.</p>
        </div>
    </div>

    <div id="buildingInfo" class="building-info"></div>

    <script>
        function showBuildingInfo(element) {{
            const address = element.getAttribute('data-address');
            const height = element.getAttribute('data-height');
            const id = element.getAttribute('data-id');

            const infoDiv = document.getElementById('buildingInfo');
            infoDiv.innerHTML = `
                <strong>Building ID:</strong> ${{id}}<br>
                <strong>Address:</strong> ${{address || 'No address'}}<br>
                <strong>Height:</strong> ${{height}}m
            `;
            infoDiv.style.display = 'block';

            // Highlight the building
            element.style.stroke = '#ff0000';
            element.style.strokeWidth = '3';
        }}

        function hideBuildingInfo() {{
            const infoDiv = document.getElementById('buildingInfo');
            infoDiv.style.display = 'none';

            // Reset all polygons
            document.querySelectorAll('polygon').forEach(poly => {{
                poly.style.stroke = 'black';
                poly.style.strokeWidth = '2';
            }});
        }}

        // Add click handler to close info panel
        document.addEventListener('click', function(event) {{
            if (!event.target.closest('polygon')) {{
                hideBuildingInfo();
            }}
        }});
    </script>
</body>
</html>'''

    # Write HTML file
    output_path = Path(__file__).parent / "index.html"
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Visualization generated: {output_path}")
        print(f"Open this file in a web browser to view the buildings")
    except Exception as e:
        print(f"Error writing HTML file: {e}")


if __name__ == "__main__":
    generate_buildings_visualization()
