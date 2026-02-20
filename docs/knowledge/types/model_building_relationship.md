# Model-Building Relationship Architecture

## Overview

In our system, there is a **one-to-many relationship** between 3D models and buildings (polygons). This reflects the real-world scenario where a single architectural structure (represented by a 3D model) may span multiple building polygons in geographic data sources.

## Key Concepts

### Model (3D Model)
- A 3D representation of an architectural structure
- Contains geometry, textures, and materials
- Stored as files (FBX, GLTF, etc.)
- Represents a complete building or complex

### Building (Polygon)
- A 2D polygon representing a building footprint in geographic data
- Contains address, height, and coordinate nodes
- Comes from OpenStreetMap or similar sources
- Multiple buildings may belong to the same physical structure

## Relationship Pattern

```
One 3D Model → Multiple Building Polygons
```

### Example Scenarios:

1. **Large Complex**
   - Single shopping mall model
   - Multiple building polygons for different wings/sections

2. **Connected Structures**
   - University campus with interconnected buildings
   - One model for the entire campus
   - Multiple polygons for individual buildings

3. **Multi-part Architecture**
   - Office complex with main tower and annexes
   - Single architectural model
   - Separate polygons in geographic data

## Technical Implications

### Data Structure
```typescript
interface ModelAlignment {
  modelId: string;
  // Applies to ALL associated buildings
  position: Position;
  scale: number;
  rotation?: Rotation;
}

interface Building {
  address: string | null;
  nodes: BuildingNode[];
  height: number;
  position?: BuildingNode;
  modelUrl?: string;  // Points to shared model

  model?: string;
}
```

### UI/UX Considerations
- Model selection should allow multi-building association
- Alignment transformations apply to all associated buildings
- Visual feedback showing which buildings share a model
- Ability to add/remove buildings from model association

### Backend Storage
- Need to store model-to-buildings mapping
- Alignment data applies to model, not individual buildings
- API endpoints for managing model-building associations

## Workflow Impact

### Model Setup Process
1. Upload 3D model
2. Select primary building (anchor point)
3. Add additional buildings to association
4. Apply alignment to entire group

### Alignment Process
- Transformations affect all associated buildings simultaneously
- Visual reference shows all building polygons
- Bounding box considers entire associated area

## Future Considerations

- Support for hierarchical models (main building + sub-models)
- Different alignment presets for different building groups
- Partial model visibility for complex associations
- Conflict resolution when buildings have overlapping model assignments
