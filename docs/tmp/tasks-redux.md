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

3. **Task R3**: Wrap application with Provider
   - Update main App component or index.tsx
   - Add Redux Provider with store

### Phase 2: Core Slices Design
**Design and implement essential slices for model alignment**

4. **Task S1**: Create `alignmentSlice`
   - Store model transformation data (position, rotation, scale)
   - Track current alignment state for each building
   - Handle alignment updates and resets

5. **Task S2**: Create `uiSlice`
   - Manage modal/dialog visibility states
   - Track current active mode (view/alignment)
   - Handle loading states and notifications

6. **Task S3**: Create `buildingsSlice`
   - Cache building data from API
   - Handle building selection state
   - Manage building filters and search

### Phase 3: Integration with Existing Components
**Migrate component state to Redux where appropriate**

7. **Task I1**: Update alignment components
   - Connect `AlignmentStage` to alignmentSlice
   - Update transformation controls to dispatch actions
   - Handle real-time state synchronization

8. **Task I2**: Update UI components
   - Connect modal/dialog components to uiSlice
   - Implement mode switching functionality
   - Add loading states for API calls

### Phase 4: API Integration and Async Logic
**Add middleware for API calls and async operations**

9. **Task A1**: Create API service layer
   - Define API endpoints for alignment data
   - Create async thunks for alignment operations
   - Handle error states and retry logic

10. **Task A2**: Integrate with backend alignment API
    - Connect alignmentSlice to backend endpoints
    - Implement auto-save functionality
    - Handle offline/online state

### Phase 5: Advanced Features
**Add sophisticated state management features**

11. **Task F1**: Implement undo/redo functionality
    - Add history tracking for alignment changes
    - Create undo/redo actions
    - Limit history size for performance

12. **Task F2**: Add persistence
    - Save alignment state to localStorage
    - Restore state on app reload
    - Handle version migration

## Technical Considerations

### Store Structure
```typescript
interface RootState {
  alignment: AlignmentState;
  ui: UIState;
  buildings: BuildingsState;
  // Future: models: ModelsState;
}
```

### Key Dependencies
- `@reduxjs/toolkit` - Core Redux Toolkit
- `react-redux` - React bindings
- (Optional) `redux-persist` - State persistence

### Migration Strategy
- Start with new features using Redux
- Gradually migrate existing useState where beneficial
- Maintain backward compatibility during transition

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