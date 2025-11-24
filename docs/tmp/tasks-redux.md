# Redux Toolkit Implementation Plan

## Overview
Add Redux Toolkit for centralized state management to handle model alignment transformations, UI dialogs, and complex application state.

## Implementation Phases

### Phase 1: Setup and Basic Store
**Install dependencies and create basic store structure**

1. **Task R1**: ✅ Install Redux Toolkit dependencies
   - Install `@reduxjs/toolkit` and `react-redux`
   - Update package.json with new dependencies

2. **Task R2**: ✅ Create store configuration
   - Create `store/index.ts` with store setup
   - Configure middleware (thunk by default)
   - Set up TypeScript types for store

3. **Task R3**: ✅ Wrap application with Provider
   - Update main App component or index.tsx
   - Add Redux Provider with store

### Phase 2: Core Slices Design
**Design and implement essential slices for model alignment**

4. **Task S1**: Create `alignmentSlice`
   - Store model transformation data (position, rotation, scale)
   - Track current alignment state for each building
   - Handle alignment updates and resets

5. **Task S2**: Create `modelSetupSlice`
   - Manage Model Setup Mode state
   - Track uploaded model file and metadata
   - Store selected building polygons for model association
   - Handle address assignment and model validation

6. **Task S3**: ✅ Create `uiSlice`
   - Track current active mode (view/alignment/modelSetup)
   - Handle basic UI state management

7. **Task S4**: Create `notificationsSlice`
   - Manage notification messages and toasts
   - Handle notification visibility and timing
   - Support different notification types (success, error, warning)

8. **Task S5**: Create `buildingsSlice`
   - Cache building data from API
   - Handle building selection state
   - Manage building filters and search

### Phase 3: Integration with Existing Components
**Migrate component state to Redux where appropriate**

9. **Task I1**: Create `ModelSetupUI` component
   - File upload interface for 3D models
   - Address selection/input form
   - Polygon selection interface with visual highlighting
   - Basic model positioning controls

10. **Task I2**: Update alignment components
    - Connect `AlignmentStage` to alignmentSlice
    - Update transformation controls to dispatch actions
    - Handle real-time state synchronization

11. **Task I3**: Update UI components
    - Implement mode switching functionality using uiSlice
    - Add notification components using notificationsSlice
    - Handle loading states for API calls

### Phase 4: API Integration and Async Logic
**Add middleware for API calls and async operations**

12. **Task A1**: Create API service layer
    - Define API endpoints for alignment data
    - Create async thunks for alignment operations
    - Handle error states and retry logic

13. **Task A2**: Create model upload API integration
    - File upload endpoints for 3D models
    - Model validation and processing
    - Model-polygon association endpoints

14. **Task A3**: Integrate with backend alignment API
    - Connect alignmentSlice to backend endpoints
    - Implement auto-save functionality
    - Handle offline/online state

### Phase 5: Advanced Features
**Add sophisticated state management features**

15. **Task F1**: Implement Model Setup Mode workflow
    - Seamless transition: View → Model Setup → Alignment → View
    - Context-aware mode activation (building selection)
    - Progress tracking through setup steps

16. **Task F2**: Implement undo/redo functionality
    - Add history tracking for alignment changes
    - Create undo/redo actions
    - Limit history size for performance

17. **Task F3**: Add persistence
    - Save alignment state to localStorage
    - Restore state on app reload
    - Handle version migration

## Technical Considerations

### Store Structure
```typescript
interface RootState {
  alignment: AlignmentState;
  modelSetup: ModelSetupState;
  ui: UIState;
  notifications: NotificationsState;
  buildings: BuildingsState;
  // Future: models: ModelsState;
}
```

### Model Setup Mode Flow
1. **Activation**: Click on building or "Add Model" button
2. **Model Upload**: Drag & drop or file selection (.fbx, .gltf)
3. **Address Assignment**: Select existing address or create new
4. **Polygon Selection**: Choose one or multiple corresponding polygons
5. **Basic Positioning**: Rough alignment with polygons
6. **Transition**: Move to Alignment Mode for precise adjustments

### Visual Distinctions Between Modes
- **View Mode**: Solid polygons, no setup UI
- **Model Setup Mode**: Transparent polygons + uploaded model + setup panel
- **Alignment Mode**: Transparent polygons + model + precision controls

### Key Dependencies
- `@reduxjs/toolkit` - Core Redux Toolkit
- `react-redux` - React bindings
- (Optional) `redux-persist` - State persistence

### Migration Strategy
- Start with new features using Redux
- Gradually migrate existing useState where beneficial
- Maintain backward compatibility during transition

### User Experience Considerations
- Clear visual feedback for mode transitions
- Intuitive polygon selection with highlighting
- Progress indicators during model upload
- Contextual help for each setup step
- Easy cancellation/rollback at any stage

## Success Criteria
- Centralized state management for alignment data
- Predictable state updates and debugging
- Seamless integration with existing components
- Type-safe Redux implementation
- Performance optimization for 3D transformations

## Notes
- Current useState implementations can remain until migration is beneficial
- Focus on new alignment functionality first
- Use Redux DevTools for development and debugging
- Consider code-splitting for large slices if needed