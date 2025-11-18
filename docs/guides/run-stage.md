# Run-Stage Command

A comprehensive command for managing the project build pipeline with dependency tracking.

## Overview

The `run-stage` command automates the project build process by executing stages in the correct order and only when necessary based on file changes.

## Available Stages

### `run-stage import` or `run-stage maps`
- Downloads map data from Overpass API
- Creates `stages/import/map_data.xml`
- Triggered when `stages/import/input.json` changes

### `run-stage buildings`
- Parses building data from `map_data.xml`
- Creates `stages/import/buildings.json` and `stages/import/itc.json`
- Triggered when `map_data.xml` changes

### `run-stage backend` or `run-stage server`
- Builds the Fastify application (without starting it)
- Triggered when `docs/knowledge/stages/serve_buildings.md` changes

### `run-stage all`
- Executes all stages in dependency order
- Only runs stages whose dependencies have changed
- Full pipeline: import → buildings → backend

## Implementation

### Bash Function

```bash
run-stage() {
    local stage="$1"
    
    case "$stage" in
        import|maps)
            echo "Running import stage..."
            if [ ! -f "stages/import/input.json" ]; then
                echo "Error: stages/import/input.json not found"
                return 1
            fi
            
            # Check if input.json has changed
            if [ ! -f "stages/import/.last_input_hash" ] || \
               [ "$(md5sum stages/import/input.json | cut -d' ' -f1)" != "$(cat stages/import/.last_input_hash)" ]; then
                echo "Input configuration changed, downloading new map data..."
                
                # Read coordinates from input.json
                local coords=$(python3 -c "
import json
with open('stages/import/input.json', 'r') as f:
    data = json.load(f)
start = data['start']
end = data['end']
print(f'{start[\"lng\"]},{end[\"lat\"]},{end[\"lng\"]},{start[\"lat\"]}')
")
                
                # Download map data
                curl -s "https://overpass-api.de/api/map?bbox=$coords" -o stages/import/map_data.xml
                
                # Save input hash
                md5sum stages/import/input.json | cut -d' ' -f1 > stages/import/.last_input_hash
                echo "✅ Import stage completed"
            else
                echo "✅ Import stage already up to date"
            fi
            ;;
            
        buildings)
            echo "Running buildings stage..."
            if [ ! -f "stages/import/map_data.xml" ]; then
                echo "Error: stages/import/map_data.xml not found. Run 'run-stage import' first."
                return 1
            fi
            
            # Check if map_data.xml has changed
            if [ ! -f "stages/import/.last_map_hash" ] || \
               [ "$(md5sum stages/import/map_data.xml | cut -d' ' -f1)" != "$(cat stages/import/.last_map_hash)" ]; then
                echo "Map data changed, parsing buildings..."
                
                # Run building parser
                python3 stages/import/parse_buildings.py
                
                # Save map hash
                md5sum stages/import/map_data.xml | cut -d' ' -f1 > stages/import/.last_map_hash
                echo "✅ Buildings stage completed"
            else
                echo "✅ Buildings stage already up to date"
            fi
            ;;
            
        backend|server)
            echo "Running backend stage..."
            if [ ! -f "docs/knowledge/stages/serve_buildings.md" ]; then
                echo "Error: serve_buildings.md not found"
                return 1
            fi
            
            # Check if serve_buildings.md has changed
            if [ ! -f "stages/serve_buildings/.last_spec_hash" ] || \
               [ "$(md5sum docs/knowledge/stages/serve_buildings.md | cut -d' ' -f1)" != "$(cat stages/serve_buildings/.last_spec_hash)" ]; then
                echo "API specification changed, building backend..."
                
                # Install dependencies if needed
                if [ ! -d "stages/serve_buildings/node_modules" ]; then
                    echo "Installing dependencies..."
                    cd stages/serve_buildings && npm install
                fi
                
                # Save spec hash
                md5sum docs/knowledge/stages/serve_buildings.md | cut -d' ' -f1 > stages/serve_buildings/.last_spec_hash
                echo "✅ Backend stage completed"
            else
                echo "✅ Backend stage already up to date"
            fi
            ;;
            
        all)
            echo "Running complete pipeline..."
            run-stage import
            run-stage buildings
            run-stage backend
            echo "✅ All stages completed"
            ;;
            
        *)
            echo "Usage: run-stage <stage>"
            echo "Available stages: import, maps, buildings, backend, server, all"
            return 1
            ;;
    esac
}
```

### Python Implementation (Alternative)

```python
#!/usr/bin/env python3
"""
Run-Stage Command Implementation
"""

import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

class RunStage:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent
        
    def get_file_hash(self, filepath):
        """Calculate MD5 hash of a file."""
        if not filepath.exists():
            return None
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    
    def save_hash(self, stage, file_hash):
        """Save hash for dependency tracking."""
        hash_file = self.base_dir / f"stages/{stage}/.last_{stage}_hash"
        hash_file.parent.mkdir(parents=True, exist_ok=True)
        with open(hash_file, 'w') as f:
            f.write(file_hash)
    
    def get_saved_hash(self, stage):
        """Get saved hash for dependency tracking."""
        hash_file = self.base_dir / f"stages/{stage}/.last_{stage}_hash"
        if hash_file.exists():
            with open(hash_file, 'r') as f:
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
            with open(input_file, 'r') as f:
                config = json.load(f)
            
            start = config['start']
            end = config['end']
            bbox = f"{start['lng']},{end['lat']},{end['lng']},{start['lat']}"
            
            # Download map data
            map_file = self.base_dir / "stages/import/map_data.xml"
            url = f"https://overpass-api.de/api/map?bbox={bbox}"
            
            result = subprocess.run(
                ["curl", "-s", url, "-o", str(map_file)],
                capture_output=True, text=True
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
            print("Error: stages/import/map_data.xml not found. Run 'run-stage import' first.")
            return False
        
        current_hash = self.get_file_hash(map_file)
        saved_hash = self.get_saved_hash("buildings")
        
        if saved_hash != current_hash:
            print("Map data changed, parsing buildings...")
            
            # Run building parser
            parser_script = self.base_dir / "stages/import/parse_buildings.py"
            result = subprocess.run(
                ["python3", str(parser_script)],
                capture_output=True, text=True
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
                    capture_output=True, text=True
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
    if len(sys.argv) != 2:
        print("Usage: run-stage <stage>")
        print("Available stages: import, maps, buildings, backend, server, all")
        sys.exit(1)
    
    stage = sys.argv[1]
    runner = RunStage()
    
    stages = {
        'import': runner.run_import,
        'maps': runner.run_import,
        'buildings': runner.run_buildings,
        'backend': runner.run_backend,
        'server': runner.run_backend,
        'all': runner.run_all
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
```

## Usage

### Add to Shell Configuration
Add the bash function to your `.bashrc` or `.zshrc`:

```bash
source /path/to/project/docs/guides/run-stage.md
```

### Or Use Python Script
```bash
# Make executable
chmod +x docs/guides/run-stage.py

# Create alias
alias run-stage="python3 docs/guides/run-stage.py"

# Usage
run-stage import
run-stage buildings
run-stage all
```

## Features

- **Dependency Tracking**: Only runs stages when dependencies change
- **Hash-based Detection**: Uses MD5 hashes to detect file changes
- **Error Handling**: Provides clear error messages
- **Flexible**: Both bash and Python implementations available
- **Incremental**: Avoids unnecessary work when files haven't changed

## Dependencies

- `curl` for downloading map data
- `python3` for building parsing
- `nodejs` and `npm` for backend
- `md5sum` (for bash version)