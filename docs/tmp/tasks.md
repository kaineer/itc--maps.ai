# Model Alignment Tool Implementation Plan

## Overview
Create a system for aligning 3D models with their corresponding building polygons, allowing precise positioning and scaling adjustments with visual feedback.

## Implementation Phases

### Phase 1: Transparent Polygon Buildings
**Create base and specialized polygon building components**

1. **Task P1**: ✅ Create `BasePolygonBuilding` component
   - Extract common logic from current `PolygonBuilding`
   - Accept `opacity` as prop for material transparency

2. **Task P2**: ✅ Create `TransparentPolygonBuilding` component
   - Extends `BasePolygonBuilding` with `opacity: 0.5`
   - Used during model alignment for visual reference

3. **Task P3**: ✅ Create `SolidPolygonBuilding` component  
   - Extends `BasePolygonBuilding` with `opacity: 1.0`
   - Used for normal building display

### Phase 1.5: Stage Components
**Create main scene components for different display modes**

4. **Task S1**: ✅ Create `ViewStage` component
   - Main component for normal viewing mode
   - Displays solid polygons and models
   - Located in `stage/ui/ViewStage.tsx`

5. **Task S2**: ✅ Create `AlignmentStage` component
   - Main component for model alignment mode
   - Displays transparent polygons and aligned models
   - Located in `stage/ui/AlignmentStage.tsx`

### Phase 2: Backend Alignment API
**Add API endpoints for storing model alignment data**

6. **Task B1**: Define `ModelAlignment` type in TypeScript
   - Add to `types/types.ts`
   - Include `modelId`, `position`, `scale`, `rotation` properties

7. **Task B2**: Add PUT endpoint `/building/:buildingId/alignment`
   - Create in `stages/serve_buildings/index.js`
   - Store alignment data in memory or file-based storage
   - Return current alignment settings

8. **Task B3**: Add GET endpoint `/building/:buildingId/alignment`
   - Retrieve stored alignment data
   - Return default values if no alignment exists

### Phase 3: Aligned Model Component
**Create interactive model component with alignment controls**

9. **Task M1**: Create `AlignedModel` component
   - Extends current model loading functionality
   - Applies stored alignment transformations
   - Handles interactive positioning (drag & drop or input controls)

10. **Task M2**: Add real-time transformation updates
    - Update model position/scale when controls change
    - Visual feedback during transformations
    - Optional snapping to grid for precise alignment

### Phase 4: Alignment Controls Interface
**Build the control panel for model adjustments**

11. **Task C1**: Create `AlignmentControls` component
    - Numeric inputs for X/Z position adjustment
    - Scale slider with precision controls
    - Rotation controls (if needed)
    - Save/Reset functionality

12. **Task C2**: Implement model selection
    - Dropdown to select which model to align
    - Visual highlighting of selected model
    - Load corresponding polygon for reference

### Phase 5: Model Alignment Tool
**Integrate all components into a cohesive tool**

13. **Task T1**: Create `ModelAlignmentTool` component
    - Main container for alignment mode
    - Toggle between normal and alignment modes
    - Coordinate display of transparent polygons and aligned models

14. **Task T2**: Add visual helpers
    - Coordinate grid overlay
    - Bounding box visualization for both model and polygon
    - Distance measurements between corresponding points

### Phase 6: Integration and Testing
**Ensure the system works end-to-end**

15. **Task I1**: Integrate alignment tool into main application
    - Add mode switching mechanism
    - Persist alignment data between sessions
    - Handle multiple models and buildings

16. **Task I2**: Comprehensive testing
    - Test alignment precision and accuracy
    - Verify data persistence
    - Performance testing with multiple models

## Technical Considerations

### Data Flow
- Alignment changes → API call → State update → Visual refresh
- Real-time preview with debounced save operations

### User Experience
- Intuitive controls for non-technical users
- Visual feedback for all interactions
- Undo/redo capabilities for alignment adjustments

### Performance
- Efficient re-rendering during transformations
- Optimized polygon rendering with transparency
- Lazy loading of alignment data

## Success Criteria
- Models can be precisely aligned with their corresponding polygons
- Alignment data persists between sessions
- Users can easily switch between normal and alignment modes
- System handles multiple buildings and models efficiently
- Visual feedback clearly shows alignment progress

## Future Enhancements
- Batch alignment for multiple models
- Import/export of alignment presets
- Automated alignment suggestions based on polygon matching
- Advanced transformation controls (rotation, skew)