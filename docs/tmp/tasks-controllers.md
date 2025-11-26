# Camera Controllers Development Plan

## Phase 1: Basic Camera Controllers Setup

### Task 1: Create PerspectiveCameraController.tsx
- [x] Create basic PerspectiveCameraController component
- [x] Follow same pattern as TopCameraController (useFrame-based approach)
- [x] Integrate with Redux store using slice selectors
- [x] Use perspective camera state from alignmentSlice
- [x] No mouse/keyboard controls initially (stub implementation)

### Task 2: Verify Both Controllers Work
- [ ] Test TopCameraController functionality
- [ ] Test PerspectiveCameraController functionality  
- [ ] Ensure proper camera switching between modes
- [ ] Verify Redux state updates correctly

## Phase 2: TopCameraController Enhancement

### Task 3: Add WASD Camera Movement
- [ ] Implement keyboard event handlers for WASD keys
- [ ] Move camera position in top view
- [ ] Update camera state in Redux when moving
- [ ] Maintain orthographic view while moving

### Task 4: Add Shift+WASD Model Movement
- [ ] Detect Shift key combination with WASD
- [ ] Move model position instead of camera
- [ ] Update model transform state in Redux
- [ ] Maintain camera focus on model

### Task 5: Add Shift+Arrow Keys Step Adjustment
- [ ] Implement Shift+Up arrow to increase movement step
- [ ] Implement Shift+Down arrow to decrease movement step  
- [ ] Update positionStep in alignmentSlice
- [ ] Provide visual feedback for step changes

## Phase 3: PerspectiveCameraController Enhancement

### Task 6: Add Mouse Controls for Perspective Camera
- [ ] Implement orbit controls for rotation
- [ ] Add zoom controls (mouse wheel)
- [ ] Add pan controls (middle mouse button)
- [ ] Update camera state in Redux

### Task 7: Add Keyboard Controls for Perspective Camera
- [ ] Implement WASD movement in perspective view
- [ ] Add Q/E for vertical movement
- [ ] Maintain camera focus on model
- [ ] Update camera state in Redux

## Phase 4: Integration and Polish

### Task 8: Camera Mode Switching
- [ ] Smooth transitions between camera modes
- [ ] Preserve camera positions when switching
- [ ] Update currentCameraView in Redux

### Task 9: UI Integration
- [ ] Add camera controls to alignment interface
- [ ] Show current camera mode
- [ ] Display movement step information
- [ ] Provide keyboard shortcut hints

## Technical Requirements

### Redux Integration
- All camera state managed through alignmentSlice
- Use slice selectors and actions (destructured pattern)
- No direct root state access
- Follow author preferences for code structure

### Three.js Integration  
- Use existing camera from useThree()
- Proper type checking for camera instances
- Maintain Z-up coordinate system
- Follow project patterns from existing CameraController

### Performance
- Optimize useFrame loops
- Minimize Redux state updates
- Cache bounding box calculations
- Efficient keyboard event handling

## Success Criteria
- Both camera controllers work without type conflicts
- Keyboard controls responsive and intuitive  
- Redux state properly synchronized
- No performance issues during camera movement
- Code follows project conventions and preferences