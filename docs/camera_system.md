# Camera System Documentation

## Overview

The camera system in the Maps.ai 3D model alignment application provides multiple viewing perspectives to facilitate precise model positioning and alignment with building polygons. This system is integrated with the Redux state management for consistent camera state across the application.

## Camera Views

The system supports two distinct camera views:

### 1. Perspective View (`perspective`)
- **Purpose**: General 3D navigation and model inspection
- **Default Position**: `[10, 10, 10]`
- **Default Target**: `[0, 0, 0]`
- **Use Case**: General model viewing, free-form alignment, and final verification

### 2. Top View (`top`)
- **Purpose**: Orthographic view from above for polygon alignment
- **Default Position**: `[0, 20, 0]`
- **Default Target**: `[0, 0, 0]`
- **Use Case**: Precise positioning of models over building polygons

## Camera State Structure

```typescript
interface CameraState {
  position: [number, number, number];  // Camera position in 3D space
  target: [number, number, number];    // Camera look-at target
  fov: number;                         // Field of view in degrees
}

interface AlignmentState {
  currentCameraView: CameraView;       // Active camera view
  cameraStates: Record<CameraView, CameraState>; // All camera configurations
  // ... other alignment state properties
}
```

## Redux Integration

### Actions
- `setCameraView(view: CameraView)` - Switch between camera views
- `updateCameraState({ view, cameraState })` - Update specific camera configuration
- `resetCamera(view: CameraView)` - Reset specific camera to defaults
- `resetAllCameras()` - Reset all cameras to default configurations

### Selectors
- `getCurrentCamera()` - Get current active camera state
- `getCurrentCameraView()` - Get current camera view type

## Usage in Components

### CameraControls Component
Located at `src/components/ui/CameraControls.tsx`, this component provides:
- Camera view selection buttons with icons
- Reset functionality for individual cameras
- Reset all cameras option
- Current camera state display

### Integration with AlignmentUI
The `AlignmentUI` component automatically uses the current camera state from Redux:
- Canvas camera position and FOV are driven by Redux state
- OrbitControls target is synchronized with camera target
- Real-time updates when camera view changes

## Default Camera Configurations

```typescript
const defaultPerspectiveCamera: CameraState = {
  position: [10, 10, 10],
  target: [0, 0, 0],
  fov: 60
};

const defaultTopCamera: CameraState = {
  position: [0, 20, 0],
  target: [0, 0, 0],
  fov: 60
};
```

## Workflow for Model Alignment

1. **Initial Setup**: Start in Perspective view for general inspection
2. **Top View Alignment**: Switch to Top view for precise polygon matching
3. **Perspective Verification**: Return to Perspective view for final inspection and height verification

## Best Practices

1. **Use Top View for Polygon Alignment**: The orthographic top view provides the most accurate perspective for matching models to building polygons
2. **Use Perspective for Height Verification**: The perspective view is essential for verifying that models are properly positioned on the ground plane
3. **Reset Cameras When Needed**: Use reset functions if camera positions become misaligned
4. **Preserve User Preferences**: Camera states are maintained in Redux store during the session

## Future Enhancements

- **Custom Camera Presets**: Allow users to save and load custom camera positions
- **Camera Animation**: Smooth transitions between camera views
- **Camera Bookmarks**: Save specific camera positions for quick access
- **Orthographic/Perspective Toggle**: Switch between orthographic and perspective modes within each view