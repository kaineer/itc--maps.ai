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

## Usage

### From ai-assist Console
```bash
python3 scripts/commands/run-stage.py import
python3 scripts/commands/run-stage.py buildings
python3 scripts/commands/run-stage.py all
```

### Help and Information
```bash
python3 scripts/commands/run-stage.py --help
```

## Features

- **Dependency Tracking**: Only runs stages when dependencies change
- **Hash-based Detection**: Uses MD5 hashes to detect file changes
- **Error Handling**: Provides clear error messages
- **Incremental**: Avoids unnecessary work when files haven't changed
- **Flexible**: Can run individual stages or complete pipeline

## Dependencies

- `curl` for downloading map data
- `python3` for building parsing
- `nodejs` and `npm` for backend

## File Locations

- **Script**: `scripts/commands/run-stage.py`
- **Configuration**: `stages/import/input.json`
- **Output Files**: `stages/import/map_data.xml`, `stages/import/buildings.json`, `stages/import/itc.json`
- **Documentation**: `docs/knowledge/stages/serve_buildings.md`

## Integration

The command is designed to work seamlessly with the project's development workflow and is documented in `docs/guides/aliases.md` alongside other development commands.