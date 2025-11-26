# Author Preferences Guide

This document outlines the preferred development practices and tool configurations for this project.

## Package Manager Preferences

### pnpm Usage
Whenever possible, use `pnpm` instead of `npm` for package management operations. pnpm offers better performance, disk space efficiency, and strict dependency management.

#### Preferred Pattern

```bash
# ✅ Preferred - use pnpm
pnpm install
pnpm add package-name
pnpm run dev

# ❌ Avoid - using npm when pnpm is available
npm install
npm add package-name  
npm run dev
```

#### Rationale
- **Performance**: Faster installation times through efficient dependency resolution
- **Disk Space**: Shared dependency store reduces duplicate packages
- **Strictness**: Prevents phantom dependencies and ensures package isolation
- **Consistency**: Lockfile format ensures reproducible installations across environments

#### When to Use npm
- In environments where pnpm is not available
- For specific npm-only commands or workflows
- When working with legacy projects that require npm

## Interface Naming Preferences

### Props Interface Naming
When creating a component in a file that exports exactly one component, use the simple name `Props` for the component's interface. This reduces unnecessary verbosity and follows common React patterns.

#### Preferred Pattern

```typescript
// ✅ Correct - simple Props interface name
interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

export const ComponentName = ({ building, onClick }: Props) => {
  // component implementation
}
```

#### When to Use Alternative Names
Only use more specific interface names when:
- The file exports multiple components
- The interface is used by multiple components
- The interface represents a shared type used across the codebase

#### Examples

✅ **Single component file:**
```typescript
// ViewStage.tsx - exports only ViewStage component
interface Props {
  buildings: Building[];
}

export const ViewStage = ({ buildings }: Props) => {
  // implementation
}
```

✅ **Multiple components file:**
```typescript
// building-components.tsx - exports multiple components
interface BuildingProps {
  building: Building;
}

interface BuildingListProps {
  buildings: Building[];
}

export const BuildingItem = ({ building }: BuildingProps) => { /* ... */ }
export const BuildingList = ({ buildings }: BuildingListProps) => { /* ... */ }
```

#### Rationale
- **Simplicity**: Reduces cognitive overhead for single-component files
- **Consistency**: Follows established React community patterns
- **Readability**: Clear that `Props` refers to the main component's props
- **Maintainability**: Easy to understand and modify

## Code Export Preferences

### Named Exports
All exports from files **MUST** use named exports, even when only one component is exported from a file. This ensures consistency and makes refactoring easier.

#### Required Pattern

```typescript
// ✅ Correct - named export
export { ComponentName }

// ❌ Avoid - default export
export default ComponentName
```

#### Import Usage

```typescript
// ✅ Correct - named import
import { ComponentName } from './path/to/Component'

// ❌ Avoid - default import
import ComponentName from './path/to/Component'
```

#### Rationale
- **Consistency**: Uniform export patterns across the codebase
- **Refactoring**: Easier to rename components without breaking imports
- **Tree-shaking**: Better optimization with bundlers
- **IDE Support**: Improved autocomplete and navigation
- **Multiple Exports**: Ready for future expansion without changing patterns

## React Component Preferences

### React.FC Usage
When a function already returns JSX or null, there is no need to explicitly type it as `React.FC`. The TypeScript compiler can infer the return type automatically.

#### Preferred Pattern

```typescript
// ✅ Correct - TypeScript infers return type automatically
export const ComponentName = ({ prop1, prop2 }: Props) => {
  return <div>Content</div>;
}

```typescript
// ✅ Also correct - explicit return type when needed
export const ComponentName = ({ prop1, prop2 }: Props): JSX.Element => {
  return <div>Content</div>;
}

```typescript
// ❌ Avoid - unnecessary React.FC typing
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>Content</div>;
}
```

#### Rationale

- **Simplicity**: Reduces boilerplate and verbosity
- **Type Inference**: TypeScript can correctly infer JSX return types
- **Modern Patterns**: Aligns with current React best practices
- **Consistency**: Uniform component declaration patterns

## Git Command Preferences
### Pager Avoidance

All git commands executed through shell scripts or Python scripts **MUST** use additional flags to prevent pager waiting (waiting for spacebar or 'q' key press). This avoids unnecessary delays when users notice and need to press keys to continue.
### Required Flags

For commands that typically use a pager (like `git log`, `git diff`, etc.), always use:
```bash
# Use --no-pager flag
git --no-pager log --oneline

# Or use --no-pager with specific commands
git --no-pager diff

# For commands that don't support --no-pager, use appropriate alternatives
git log --oneline --max-count=50  # Limit output instead of using pager
```

### Examples

✅ **Correct usage:**

```bash
git --no-pager status
git --no-pager diff --staged
git --no-pager log --oneline -10
git --no-pager show --name-only HEAD
```
❌ **Avoid:**

```bash
git log  # May trigger pager
git diff  # May trigger pager
git show  # May trigger pager
```
### Configuration (Optional)

For development environments, you can configure git to never use a pager:
```bash
git config --global core.pager cat
```

## Rationale
- **Automation**: Scripts should not require user interaction
- **Efficiency**: Avoid delays in automated workflows
- **User Experience**: Prevent confusion when commands appear to "hang"
- **Consistency**: Ensure predictable behavior across all environments

## Redux Slice Access Preferences

### Slice Access Patterns
Access to Redux slices **MUST** be limited to using selectors and actions from the slice itself. Direct access to the root state should be avoided to maintain encapsulation and type safety.

#### Preferred Pattern

```typescript
// ✅ Correct - use slice selectors and actions
import { alignmentSlice } from './alignmentSlice';

// Use selectors from the slice
const currentModel = useAppSelector(alignmentSlice.selectors.getSelectedModel);

// Use actions from the slice
dispatch(alignmentSlice.actions.setCameraView('top'));

// ❌ Avoid - direct root state access
const currentModel = useAppSelector(state => state.alignment.currentModel);
```

#### Selector Usage

```typescript
// ✅ Correct - destructure selectors first, then use them
const { getSelectedModel, getModelTransform } = alignmentSlice.selectors;
const currentModel = useSelector(getSelectedModel);
const modelTransform = useSelector(getModelTransform);

// ❌ Avoid - direct selector calls in useAppSelector
const currentModel = useAppSelector(alignmentSlice.selectors.getSelectedModel);
const modelTransform = useAppSelector(alignmentSlice.selectors.getModelTransform);

// ❌ Avoid - direct state access
const alignmentState = useAppSelector(state => state.alignment);
const currentCamera = useAppSelector(state => state.alignment.cameraStates[state.currentCameraView]);
```

#### Action Usage

```typescript
// ✅ Correct - destructure actions first, then use them
const { updateCameraState } = alignmentSlice.actions;
dispatch(updateCameraState({
  view: 'top',
  cameraState: { position: [0, 20, 0], target: [0, 0, 0], fov: 60 }
}));

// ✅ Also correct - use slice actions directly
dispatch(alignmentSlice.actions.updateCameraState({
  view: 'top',
  cameraState: { position: [0, 20, 0], target: [0, 0, 0], fov: 60 }
}));

// ❌ Avoid - manual action creation
dispatch({ type: 'alignment/updateCameraState', payload: { /* ... */ } });
```

#### Rationale
- **Encapsulation**: Keeps slice implementation details private
- **Type Safety**: Selectors and actions provide proper TypeScript typing
- **Refactoring**: Easier to change slice structure without breaking components
- **Consistency**: Uniform access patterns across the codebase
- **Testability**: Selectors can be easily mocked and tested in isolation