# Task List: Coordinate Format Unification

## Problem Statement
Currently, coordinate formats are inconsistent across the project:
- **Parser**: Outputs coordinates as arrays `[x, z]`
- **Backend**: Passes coordinates as arrays in API responses
- **Frontend**: Expects coordinates as objects `{x: number, z: number}`

This causes type mismatches and runtime errors in the 3D visualization.

## Task Sequence

### Phase 1: Backend API Enhancement
**Priority: High** - Fixes immediate frontend issues

1. **Task B1**: ✅ Update backend API to convert coordinate arrays to objects
   - Modify `stages/serve_buildings/index.js` response format
   - Transform `nodes: [[x, z], ...]` → `nodes: [{x, z}, ...]`
   - Maintain backward compatibility during transition

2. **Task B2**: ✅ Update API schema documentation
   - Update Fastify response schema to reflect new format
   - Ensure type safety in backend responses

### Phase 2: Frontend Type Fixes
**Priority: High** - Fixes runtime errors

3. **Task F1**: ✅ Update frontend TypeScript interfaces
   - Fix `BuildingNode` interface in `App.tsx`
   - Update coordinate access patterns in rendering logic
   - Remove roof generation (not needed for 1.8m height view)

4. **Task F2**: ✅ Test frontend with updated backend
   - Verify 3D building rendering works correctly
   - Test coordinate transformations and wall generation
   - Frontend successfully loads and displays buildings

### Phase 3: Data Source Standardization
**Priority: Medium** - Long-term consistency

5. **Task P1**: ✅ Update parser output format
   - Modify `stages/import/parse_buildings.py` to output objects
   - Change `nodes: [[x, z], ...]` → `nodes: [{"x": x, "z": z}, ...]`

6. **Task P2**: ✅ Update ITC coordinate format
   - Change ITC center from `[x, z]` to `{"x": x, "z": z}`
   - Update all references to ITC coordinates

### Phase 4: Testing and Validation
**Priority: Medium** - Ensure system stability

7. **Task T1**: End-to-end testing
   - Test full pipeline from import to visualization
   - Verify coordinate transformations work correctly

8. **Task T2**: Performance validation
   - Ensure no performance regressions with new format
   - Test with large datasets

### Phase 5: Documentation and Cleanup
**Priority: Low** - Maintainability

9. **Task D1**: ✅ Update project documentation
   - Document new coordinate format standard
   - Update API documentation
   - Created `docs/knowledge/types/coordinate_format.md`

10. **Task D2**: ✅ Remove temporary compatibility code
    - Clean up any transitional code
    - Ensure consistent format throughout
    - Updated 2D visualization tool to work with new format

## Success Criteria
- ✅ Frontend renders 3D buildings without errors
- ✅ All coordinate transformations work correctly
- ✅ TypeScript types are consistent across project
- ✅ API responses match frontend expectations
- ✅ No data loss or coordinate corruption

## Notes
- Each task should be completed and tested before moving to the next
- Coordinate format should be standardized as `{x: number, z: number}` everywhere
- Maintain data integrity during transitions
- Test each change with the visualization to ensure it works