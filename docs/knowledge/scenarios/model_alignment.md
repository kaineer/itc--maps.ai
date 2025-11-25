# Model Alignment Scenarios

## Overview
This document describes the detailed user scenarios and technical workflows for aligning 3D models with building polygons in the Maps.ai application. The alignment process involves precise positioning, rotation, and scaling of architectural models to match real-world building footprints.

## Core Alignment Workflow

### Initial Setup Phase

#### Scenario 1: Automatic Model Placement
**User Action**: User selects multiple polygons and uploads a 3D model
**System Response**: Automatic initial positioning and camera setup

**Technical Flow**:
1. **Input Data**:
   - Selected building polygons (array of polygon data)
   - Uploaded 3D model (geometry + metadata)
   - Current scene context

2. **Automatic Calculations** (`src/utils/modelTransform.ts`):
   - **Polygon Bounding Box**: Calculate combined bounding box of selected polygons
     ```typescript
     interface BoundingBox {
       min: [number, number, number];
       max: [number, number, number];
       center: [number, number, number];
       size: [number, number, number];
     }
     ```
   - **Model Bounding Box**: Extract bounding box from 3D model geometry
   - **Scale Calculation**: Compute optimal scale to match model to polygon footprint
   - **Position Calculation**: Center model over polygon cluster

3. **Camera Setup**:
   - **Top Camera**: Positioned directly above model center at calculated height
     - Position: `[modelCenter.x, calculatedHeight, modelCenter.z]`
     - Target: `[modelCenter.x, 0, modelCenter.z]` (ground level)
     - Orthographic projection for precise alignment
   
   - **Perspective Camera**: Positioned north of model at human eye level
     - Position: `[modelCenter.x, 1.8, modelCenter.z - distance]`
     - Target: `modelCenter` (always looks at model center)
     - Perspective projection for natural viewing

4. **Initial State**:
   - Model positioned and scaled over polygons
   - Top camera active for precise alignment
   - Perspective camera ready for inspection

## Camera Control Scenarios

### Scenario 2: Top Camera Movement
**User Action**: User moves top camera to inspect specific model elements
**System Response**: Camera position updates with ground-level targeting

**Technical Flow**:
1. **Camera Movement**:
   - User pans camera using mouse/touch
   - Camera maintains orthographic projection
   - Height remains constant (calculated based on model size)

2. **Target Calculation**:
   - Target position = Camera position with Y coordinate set to 0
   - Formula: `target = [camera.x, 0, camera.z]`
   - Ensures camera always looks straight down at ground

3. **Constraints**:
   - Camera cannot rotate (fixed top-down view)
   - Zoom adjusts orthographic frustum size
   - Panning moves camera in XZ plane only

### Scenario 3: Perspective Camera Movement
**User Action**: User navigates around model in perspective view
**System Response**: Orbital camera movement around model center

**Technical Flow**:
1. **Camera Controls**:
   - **W/S**: Move camera closer/further from model center
     - Adjusts distance while maintaining orbital radius
   - **A/D**: Rotate camera around model center (orbital movement)
     - Maintains constant distance from center
   - **Mouse Drag**: Free orbital rotation around model

2. **Target Behavior**:
   - Target always locked to model center: `target = modelCenter`
   - Camera orbits around this fixed point
   - Height can vary but defaults to 1.8m (human eye level)

3. **Constraints**:
   - Minimum distance: Prevents camera from entering model
   - Maximum distance: Maintains model visibility
   - Vertical limits: Prevents extreme top/bottom views

## Model Manipulation Scenarios

### Scenario 4: Top View Model Translation
**User Action**: User moves model while in top view using Shift+WASD
**System Response**: Model translates in XZ plane with visual feedback

**Technical Flow**:
1. **Input Handling**:
   - **Shift+W**: Move model forward (positive Z)
   - **Shift+S**: Move model backward (negative Z)
   - **Shift+A**: Move model left (negative X)
   - **Shift+D**: Move model right (positive X)

2. **Movement Logic**:
   - Translation occurs in world XZ coordinates
   - Step size configurable (default: 0.5 meters)
   - Real-time visual updates with polygon highlighting

3. **Constraints**:
   - Movement restricted to ground plane (Y=0)
   - Bounds checking against scene boundaries
   - Snap-to-polygon option for precise alignment

### Scenario 5: Top View Model Rotation
**User Action**: User rotates model while in top view using Alt+A/D
**System Response**: Model rotates around Y-axis with visual feedback

**Technical Flow**:
1. **Input Handling**:
   - **Alt+A**: Rotate counter-clockwise (positive Y rotation)
   - **Alt+D**: Rotate clockwise (negative Y rotation)

2. **Rotation Logic**:
   - Rotation around model's local Y-axis
   - Step size configurable (default: 15 degrees)
   - Rotation center at model's pivot point

3. **Visual Feedback**:
   - Real-time rotation preview
   - Polygon highlighting shows alignment quality
   - Rotation angle display

## Technical Implementation

### Alignment State Structure
```typescript
interface AlignmentState {
  // Model Data
  selectedPolygons: Polygon[];
  currentModel: ModelData | null;
  
  // Model Transform
  modelPosition: [number, number, number];
  modelRotation: [number, number, number];
  modelScale: [number, number, number];
  
  // Camera States
  currentCameraView: 'top' | 'perspective';
  topCamera: CameraState;
  perspectiveCamera: CameraState;
  
  // Alignment Tools
  snapToPolygon: boolean;
  showGrid: boolean;
  showAxes: boolean;
  
  // Calculation Cache
  polygonBoundingBox: BoundingBox | null;
  modelBoundingBox: BoundingBox | null;
}
```

### Camera State Structure
```typescript
interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  isOrthographic: boolean;
  orthographicSize?: number;
}
```

### Utility Functions (`src/utils/modelTransform.ts`)
```typescript
// Bounding box calculations
export function calculatePolygonBoundingBox(polygons: Polygon[]): BoundingBox;
export function calculateModelBoundingBox(model: ModelData): BoundingBox;

// Automatic positioning
export function calculateInitialModelPosition(
  polygonBBox: BoundingBox,
  modelBBox: BoundingBox
): TransformData;

// Camera positioning
export function calculateTopCameraPosition(modelCenter: [number, number, number]): CameraState;
export function calculatePerspectiveCameraPosition(modelCenter: [number, number, number]): CameraState;
```

## User Interface Considerations

### Visual Feedback
- **Polygon Highlighting**: Selected polygons should be visually distinct
- **Model Bounding Box**: Show wireframe during manipulation
- **Alignment Guides**: Grid and axis helpers
- **Real-time Preview**: Immediate visual feedback for all transformations

### Keyboard Shortcuts Summary
| Shortcut | Action | Context |
|----------|--------|---------|
| Shift+WASD | Move model | Top view only |
| Alt+A/D | Rotate model | Top view only |
| WASD | Move perspective camera | Perspective view only |
| Mouse Drag | Rotate camera | Both views |
| Mouse Wheel | Zoom | Both views |

### Mode Transitions
- Smooth transitions between camera views
- Persistent model state across view changes
- Context-aware control schemes
- Visual indicators for active manipulation mode

## Error Handling and Edge Cases

### Validation
- Model file format compatibility
- Polygon data integrity checks
- Bounding box calculation fallbacks
- Camera position boundary enforcement

### Performance Considerations
- Efficient bounding box recalculations
- Debounced transformation updates
- Level-of-detail for complex models
- Memory management for large polygon sets

This comprehensive scenario documentation provides the foundation for implementing a robust and intuitive model alignment system that meets real-world user needs while maintaining technical excellence.