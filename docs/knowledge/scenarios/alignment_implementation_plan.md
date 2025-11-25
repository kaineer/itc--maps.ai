# Alignment System Implementation Plan

## Overview
This document outlines the step-by-step implementation plan for the revised model alignment system based on the detailed scenarios described in `model_alignment.md`.

## Phase 1: Core Infrastructure (Week 1)

### 1.1 Utility Functions (`src/utils/modelTransform.ts`)
**Priority**: HIGH
**Dependencies**: None

**Tasks**:
- [ ] Create `BoundingBox` interface and calculation functions
- [ ] Implement `calculatePolygonBoundingBox()` for multiple polygons
- [ ] Implement `calculateModelBoundingBox()` for 3D models
- [ ] Create automatic positioning logic (`calculateInitialModelPosition()`)
- [ ] Add camera positioning utilities (`calculateTopCameraPosition()`, `calculatePerspectiveCameraPosition()`)

**Deliverables**:
- Complete utility module with TypeScript types
- Unit tests for bounding box calculations
- Documentation for all utility functions

### 1.2 Revised Alignment Slice (`src/store/alignmentSlice.ts`)
**Priority**: HIGH
**Dependencies**: modelTransform utilities

**Tasks**:
- [ ] Define new `AlignmentState` interface reflecting real scenarios
- [ ] Create actions for model selection and polygon assignment
- [ ] Implement automatic positioning action
- [ ] Add camera state management actions
- [ ] Create model transformation actions (position, rotation, scale)
- [ ] Add alignment tool toggles (snap, grid, axes)

**Deliverables**:
- Complete Redux slice with proper TypeScript typing
- Actions for all user scenarios
- Selectors for state access

## Phase 2: Camera System Overhaul (Week 2)

### 2.1 Camera Controller Components
**Priority**: HIGH
**Dependencies**: Revised alignmentSlice

**Tasks**:
- [ ] Create `TopCameraController` component
- [ ] Create `PerspectiveCameraController` component
- [ ] Implement camera movement logic for both views
- [ ] Add target calculation for top camera (Y=0)
- [ ] Implement orbital movement for perspective camera
- [ ] Add camera constraints and boundaries

**Deliverables**:
- Separate camera controllers for each view type
- Smooth camera transitions
- Proper input handling

### 2.2 Camera Controls UI Updates
**Priority**: MEDIUM
**Dependencies**: Camera controllers

**Tasks**:
- [ ] Update `CameraControls` component for new camera system
- [ ] Add visual indicators for active camera mode
- [ ] Implement camera reset functionality
- [ ] Add camera position display

**Deliverables**:
- Enhanced camera control interface
- Better user feedback for camera states

## Phase 3: Model Manipulation (Week 3)

### 3.1 Input Handling System
**Priority**: HIGH
**Dependencies**: Camera system

**Tasks**:
- [ ] Create centralized input handler for keyboard shortcuts
- [ ] Implement context-aware input processing
- [ ] Add model translation (Shift+WASD) in top view
- [ ] Add model rotation (Alt+A/D) in top view
- [ ] Implement perspective camera movement (WASD)

**Deliverables**:
- Robust input handling system
- Context-sensitive controls
- No conflicting keyboard shortcuts

### 3.2 Model Transformation Components
**Priority**: HIGH
**Dependencies**: Input handling

**Tasks**:
- [ ] Create `ModelTransformControls` component
- [ ] Implement real-time transformation updates
- [ ] Add visual feedback for transformations
- [ ] Create transformation constraints and snapping

**Deliverables**:
- Smooth model manipulation
- Visual transformation feedback
- Precise control over model positioning

## Phase 4: Integration and Polish (Week 4)

### 4.1 AlignmentUI Integration
**Priority**: HIGH
**Dependencies**: All previous phases

**Tasks**:
- [ ] Update `AlignmentUI` to use new camera system
- [ ] Integrate model transformation controls
- [ ] Add visual feedback for alignment quality
- [ ] Implement mode transitions between views

**Deliverables**:
- Fully functional alignment interface
- Seamless user experience
- Professional visual design

### 4.2 Advanced Features
**Priority**: LOW
**Dependencies**: Core system complete

**Tasks**:
- [ ] Add alignment progress tracking
- [ ] Implement undo/redo functionality
- [ ] Create alignment validation system
- [ ] Add performance optimizations

**Deliverables**:
- Enhanced user experience features
- Robust error handling
- Performance improvements

## Technical Specifications

### File Structure
```
src/
├── store/
│   └── alignmentSlice.ts          # Revised alignment state
├── utils/
│   └── modelTransform.ts          # Calculation utilities
├── components/
│   ├── camera/
│   │   ├── TopCameraController.tsx
│   │   └── PerspectiveCameraController.tsx
│   ├── alignment/
│   │   └── ModelTransformControls.tsx
│   └── ui/
│       └── CameraControls.tsx     # Updated
└── hooks/
    └── useAlignmentInput.ts       # Input handling
```

### Key Interfaces
```typescript
interface AlignmentState {
  selectedPolygons: Polygon[];
  currentModel: ModelData | null;
  modelTransform: ModelTransform;
  cameras: {
    top: CameraState;
    perspective: CameraState;
    currentView: 'top' | 'perspective';
  };
  tools: AlignmentTools;
}

interface ModelTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  isOrthographic: boolean;
  orthographicSize?: number;
}
```

### Implementation Order
1. **Utility functions first** - Foundation for all calculations
2. **Redux slice second** - State management backbone
3. **Camera system third** - Core user interaction
4. **Model manipulation fourth** - Primary alignment functionality
5. **UI integration fifth** - User interface completion
6. **Polish last** - Enhanced features and optimizations

## Success Criteria

### Functional Requirements
- ✅ Automatic model positioning on polygon selection
- ✅ Intuitive camera controls for both views
- ✅ Precise model manipulation with keyboard shortcuts
- ✅ Real-time visual feedback
- ✅ Smooth transitions between camera modes

### Technical Requirements
- ✅ Type-safe implementation
- ✅ Performance optimization for complex models
- ✅ Robust error handling
- ✅ Comprehensive test coverage
- ✅ Clean, maintainable code structure

### User Experience Requirements
- ✅ Intuitive controls matching user mental models
- ✅ Clear visual feedback for all actions
- ✅ Responsive interface with no lag
- ✅ Professional appearance and behavior

## Risk Mitigation

### Technical Risks
- **Complex 3D calculations**: Use proven Three.js utilities and thorough testing
- **Performance with large models**: Implement level-of-detail and efficient updates
- **Input conflict resolution**: Clear context-aware input handling

### UX Risks
- **Learning curve**: Progressive disclosure of features, clear tooltips
- **Mode confusion**: Clear visual indicators for active modes
- **Precision issues**: Snap-to-grid and alignment guides

This implementation plan provides a structured approach to building a robust, user-friendly model alignment system that addresses all identified user scenarios while maintaining technical excellence.