# Coordinate Format Standard

## Overview

This document defines the standard coordinate format used throughout the maps.ai project for consistent data exchange between components.

## Format Specification

### Coordinate Object
All coordinates in the system MUST use the following object format:

```typescript
interface Coordinate {
  x: number;
  z: number;
}
```

### Rationale
- **x**: Represents the horizontal coordinate (east-west axis)
- **z**: Represents the vertical coordinate (north-south axis) 
- Using objects instead of arrays provides better type safety and self-documenting code
- Consistent with Three.js coordinate system conventions

## Usage Across Components

### 1. Data Import (Parser)
**File**: `stages/import/parse_buildings.py`
- Input: Latitude/Longitude from OpenStreetMap XML
- Output: `{ "x": number, "z": number }` objects
- Coordinate transformation applied during parsing

### 2. Backend API
**File**: `stages/serve_buildings/index.js`
- Request body: `{ "position": { "x": number, "z": number }, "distance": number }`
- Response: `{ "buildings": [{ "nodes": [{ "x": number, "z": number }, ...] }] }`
- All coordinate calculations use object format

### 3. Frontend (3D Visualization)
**File**: `stages/display_buildings/src/App.tsx`
- TypeScript interface: `interface BuildingNode { x: number; z: number; }`
- Three.js integration uses object properties directly
- No coordinate transformation needed at render time

## Examples

### Valid Coordinate
```json
{
  "x": -326.3075974725192,
  "z": 668.0390612696756
}
```

### Building Data Structure
```json
{
  "address": "улица Чкалова, 3",
  "height": 15.0,
  "nodes": [
    { "x": -348.7055016181524, "z": 667.4200661525986 },
    { "x": -369.827400215806, "z": 703.6383682468718 },
    { "x": -366.1704422868074, "z": 706.3065049619443 }
  ]
}
```

## Coordinate System Notes

- **Origin**: The coordinate system is normalized with the ITC building at Чкалова, 3 as reference point
- **Scale**: Coordinates are scaled to reasonable values (0-1000 range)
- **Mirroring**: X coordinates are inverted during import to fix mirroring issues
- **Units**: Arbitrary units optimized for 3D visualization scale

## Migration History

- **Before**: Coordinates were arrays `[x, z]` causing type mismatches
- **After**: Standardized to objects `{x, z}` for consistency and type safety
- **Migration Date**: Implemented in coordinate format unification tasks

## Validation

All components should validate:
- `x` and `z` are numbers
- Coordinates are within expected bounds
- Object structure matches the defined interface

This standard ensures consistent data flow from data import through 3D visualization.