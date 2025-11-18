# Author Preferences Guide

This document outlines the preferred development practices and tool configurations for this project.

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