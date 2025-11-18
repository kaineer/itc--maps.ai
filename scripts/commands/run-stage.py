#!/usr/bin/env python3
"""
Run-Stage Command Implementation

A comprehensive command for managing the project build pipeline with dependency tracking.
"""

import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path


class RunStage:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent.parent

    def get_file_hash(self, filepath):
        """Calculate MD5 hash of a file."""
        if not filepath.exists():
            return None
        with open(filepath, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()

    def save_hash(self, stage, file_hash):
        """Save hash for dependency tracking."""
        hash_file = self.base_dir / f"stages/{stage}/.last_{stage}_hash"
        hash_file.parent.mkdir(parents=True, exist_ok=True)
        with open(hash_file, "w") as f:
            f.write(file_hash)

    def get_saved_hash(self, stage):
        """Get saved hash for dependency tracking."""
        hash_file = self.base_dir / f"stages/{stage}/.last_{stage}_hash"
        if hash_file.exists():
            with open(hash_file, "r") as f:
                return f.read().strip()
        return None

    def run_import(self):
        """Run import stage."""
        print("Running import stage...")
        input_file = self.base_dir / "stages/import/input.json"

        if not input_file.exists():
            print("Error: stages/import/input.json not found")
            return False

        current_hash = self.get_file_hash(input_file)
        saved_hash = self.get_saved_hash("import")

        if saved_hash != current_hash:
            print("Input configuration changed, downloading new map data...")

            # Read coordinates
            with open(input_file, "r") as f:
                config = json.load(f)

            start = config["start"]
            end = config["end"]
            bbox = f"{start['lng']},{end['lat']},{end['lng']},{start['lat']}"

            # Download map data
            map_file = self.base_dir / "stages/import/map_data.xml"
            url = f"https://overpass-api.de/api/map?bbox={bbox}"

            result = subprocess.run(
                ["curl", "-s", url, "-o", str(map_file)], capture_output=True, text=True
            )

            if result.returncode != 0:
                print(f"Error downloading map data: {result.stderr}")
                return False

            self.save_hash("import", current_hash)
            print("✅ Import stage completed")
            return True
        else:
            print("✅ Import stage already up to date")
            return False

    def run_buildings(self):
        """Run buildings stage."""
        print("Running buildings stage...")
        map_file = self.base_dir / "stages/import/map_data.xml"

        if not map_file.exists():
            print(
                "Error: stages/import/map_data.xml not found. Run 'run-stage import' first."
            )
            return False

        current_hash = self.get_file_hash(map_file)
        saved_hash = self.get_saved_hash("buildings")

        if saved_hash != current_hash:
            print("Map data changed, parsing buildings...")

            # Run building parser
            parser_script = self.base_dir / "stages/import/parse_buildings.py"
            result = subprocess.run(
                ["python3", str(parser_script)], capture_output=True, text=True
            )

            if result.returncode != 0:
                print(f"Error parsing buildings: {result.stderr}")
                return False

            self.save_hash("buildings", current_hash)
            print("✅ Buildings stage completed")
            return True
        else:
            print("✅ Buildings stage already up to date")
            return False

    def run_backend(self):
        """Run backend stage."""
        print("Running backend stage...")
        spec_file = self.base_dir / "docs/knowledge/stages/serve_buildings.md"

        if not spec_file.exists():
            print("Error: serve_buildings.md not found")
            return False

        current_hash = self.get_file_hash(spec_file)
        saved_hash = self.get_saved_hash("serve_buildings")

        if saved_hash != current_hash:
            print("API specification changed, building backend...")

            # Install dependencies if needed
            backend_dir = self.base_dir / "stages/serve_buildings"
            node_modules = backend_dir / "node_modules"

            if not node_modules.exists():
                print("Installing dependencies...")
                result = subprocess.run(
                    ["npm", "install"],
                    cwd=str(backend_dir),
                    capture_output=True,
                    text=True,
                )
                if result.returncode != 0:
                    print(f"Error installing dependencies: {result.stderr}")
                    return False

            self.save_hash("serve_buildings", current_hash)
            print("✅ Backend stage completed")
            return True
        else:
            print("✅ Backend stage already up to date")
            return False

    def run_all(self):
        """Run all stages."""
        print("Running complete pipeline...")
        self.run_import()
        self.run_buildings()
        self.run_backend()
        print("✅ All stages completed")


def main():
    if len(sys.argv) != 2 or sys.argv[1] in ["-h", "--help"]:
        print("Usage: run-stage <stage>")
        print("Available stages: import, maps, buildings, backend, server, all")
        print("")
        print("Examples:")
        print("  run-stage import     # Download map data from Overpass API")
        print("  run-stage buildings  # Parse buildings from map data")
        print("  run-stage all        # Run complete pipeline")
        print("")
        print("Features:")
        print("  - Dependency tracking with hash-based change detection")
        print("  - Incremental builds (only runs when dependencies change)")
        print("  - Clear status reporting and error handling")
        sys.exit(0 if sys.argv[1] in ["-h", "--help"] else 1)

    stage = sys.argv[1]
    runner = RunStage()

    stages = {
        "import": runner.run_import,
        "maps": runner.run_import,
        "buildings": runner.run_buildings,
        "backend": runner.run_backend,
        "server": runner.run_backend,
        "all": runner.run_all,
    }

    if stage in stages:
        success = stages[stage]()
        sys.exit(0 if success else 1)
    else:
        print(f"Unknown stage: {stage}")
        print("Available stages: import, maps, buildings, backend, server, all")
        sys.exit(1)


if __name__ == "__main__":
    main()
