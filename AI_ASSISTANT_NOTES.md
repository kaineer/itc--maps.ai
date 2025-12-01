# AI Assistant Notes for Maps.ai Project

## Quick Reference for AI Assistants

### Essential Files to Read at Session Start
1. **`AGENTS.md`** - Project overview and structure
2. **`docs/guides/author_preferences.md`** - Development preferences and AI command instructions
3. **`docs/tmp/summary.md`** - Current project status and next steps

### AI Assistant Commands (NOT System Commands)
When the user says these commands, the AI should execute the described workflows:

#### `git-commit` - AI Assistant Workflow
**What to do when user says "git-commit":**
1. Check git status: `git --no-pager status`
2. Analyze changes: Review `git --no-pager diff` output
3. Create meaningful commit message in English explaining:
   - What was changed (features, fixes, etc.)
   - Why it was changed (purpose, requirements)
   - Technical details if relevant
4. Stage all changes: `git add .`
5. Commit: `git commit -m "Title" -m "Detailed description"`
6. Verify: `git --no-pager log --oneline -3`

**Example commit structure:**
```
Add model rotation controls to TopCameraController

- Implement Ctrl+A/D for Y-axis model rotation
- Add Ctrl+↑/↓ for rotation step adjustment (1° to 90°)
- Import rotation actions from alignmentSlice
- Fix useCallback dependencies
- Remove unnecessary React import from AlignmentUI
```

#### `git-push` - AI Assistant Workflow
**What to do when user says "git-push":**
1. Check for working tree changes: `git --no-pager status`
2. If changes exist: Run git-commit workflow first
3. Check commits ready for push: `git --no-pager log --oneline origin/master..HEAD`
4. Push commits: `git push origin master`
5. Provide status report

### Real System Commands
These are actual commands that can be run in terminal:

#### `run-stage` - Build pipeline command
**Location:** `scripts/commands/run-stage.py`

**Usage:**
```bash
python3 scripts/commands/run-stage.py import    # Import map data
python3 scripts/commands/run-stage.py buildings # Parse buildings
python3 scripts/commands/run-stage.py backend   # Build Fastify app
python3 scripts/commands/run-stage.py all       # Full pipeline
```

### Project Standards (from author_preferences.md)

#### Code Standards
- **Named exports only** - no default exports
- **Simple `Props` interface** for single-component files
- **No `React.FC` typing** when TypeScript can infer return types
- **Redux slice access** through destructured selectors and actions

#### Git Preferences
- **Pager avoidance**: Always use `--no-pager` flag or limit output
- **Example**: `git --no-pager status`, `git --no-pager log --oneline -10`

#### Package Manager
- **Preferred**: `pnpm` (faster, more efficient)
- **Avoid**: `npm` when pnpm is available

### Development Patterns

#### Component Testing Methodology
Use dual-component approach for testing:
- `.test-version` - Generic test version
- `.alignment-test` - Camera/3D alignment testing
- `.api-test` - API integration testing
- `.state-test` - Redux/state management testing

**Example TODO comment:**
```typescript
// TODO: Change back after camera alignment testing is complete
import { ViewUI } from "./components/ui/ViewUI.alignment-test";
```

#### Redux Access Pattern
```typescript
// ✅ Correct - use slice selectors and actions
import { alignmentSlice } from './alignmentSlice';
const { getSelectedModel } = alignmentSlice.selectors;
const { updateCameraState } = alignmentSlice.actions;

// ❌ Avoid - direct root state access
const currentModel = useAppSelector(state => state.alignment.currentModel);
```

### Common File Locations
- **Source code**: `stages/display_buildings/src/`
- **Store/Redux**: `stages/display_buildings/src/store/`
- **Components**: `stages/display_buildings/src/components/`
- **Cameras**: `stages/display_buildings/src/components/cameras/`
- **Documentation**: `docs/`

### Current Development Context
- **Working on**: Camera alignment system for 3D model alignment
- **Current file**: `TopCameraController.tsx` (camera controls)
- **Related files**: `alignmentSlice.ts` (Redux state), `AlignmentUI.tsx` (UI)
- **Phase**: Phase 2 - TopCameraController enhancement (from tasks-controllers.md)

### Key Technical Details
- Camera controllers use `useFrame`-based approach
- Coordinate system: Y-up (Three.js default)
- Camera types: `OrthographicCamera` (top view), `PerspectiveCamera` (3D view)
- Model transform includes: position, rotation, scale
- Rotation steps: [1, 2, 5, 10, 15, 30, 60, 90] degrees

### Troubleshooting Notes
- Chrome DevTools: Console logs inside `console.group()` may not display after clear
- Solution: Ensure some logs are outside groups
- Git pager: Always use `--no-pager` flag to avoid waiting for user input

---

*Last Updated: Session focused on adding rotation controls to TopCameraController*