# Author Preferences Guide

This document outlines the preferred development practices and tool configurations for this project.

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

## Additional Preferences

### Code Style
- Use consistent indentation (spaces preferred)
- Follow language-specific style guides
- Include meaningful comments for complex logic

### Documentation
- Keep documentation up to date with code changes
- Use clear, concise language
- Include examples where helpful

### Error Handling
- Provide informative error messages
- Handle edge cases gracefully
- Log relevant debugging information

### Frontend/Backend Launch Policy
- **User-initiated only**: Frontend and backend parts must be launched exclusively by the user
- **Request permission**: If needed, ai-assist may request the user to launch frontend or backend components
- **No automatic launches**: Never launch frontend or backend automatically without explicit user confirmation
- **Clear communication**: Always inform the user when frontend/backend components need to be running for specific tasks