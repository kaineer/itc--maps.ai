# Git Commands for AI Assistant

## Important Note for AI Assistant
These are not system commands but instructions for how the AI assistant should handle git operations.
When the user says "git-commit" or "git-push", the AI should perform the described workflow.

## git-commit (AI Assistant Workflow)

**AI Assistant Instructions:** When the user says "git-commit", perform the following:

1. **Check git status**: `git --no-pager status`
2. **Analyze changes**: Review `git --no-pager diff` output to understand what was changed and why
3. **Create meaningful commit message** in English that explains:
   - What was changed (features added, bugs fixed, etc.)
   - Why it was changed (purpose, requirements, etc.)
   - Technical details if relevant
4. **Stage all changes**: `git add .`
5. **Commit with descriptive message**: `git commit -m "Title" -m "Detailed description"`
6. **Verify commit**: `git --no-pager log --oneline -3`

**Example commit structure:**
```
Add model rotation controls to TopCameraController

- Implement Ctrl+A/D for Y-axis model rotation
- Add Ctrl+↑/↓ for rotation step adjustment (1° to 90°)
- Import rotation actions from alignmentSlice
- Fix useCallback dependencies
- Remove unnecessary React import from AlignmentUI
```

## git-push (AI Assistant Workflow)

**AI Assistant Instructions:** When the user says "git-push", perform the following:

1. **Check for working tree changes**: `git --no-pager status`
2. **If changes exist**: Run the git-commit workflow first
3. **Check commits ready for origin master**: `git --no-pager log --oneline origin/master..HEAD`
4. **Push commits**: `git push origin master`
5. **Provide status report**: Show what was pushed and current status

**Workflow:**
- First ensure all changes are committed (run git-commit workflow if needed)
- Then push committed changes to origin/master
- Report success/failure and current branch status

## run-stage (System Command)

**Note:** This is an actual system command, not an AI workflow.

**Location:** `scripts/commands/run-stage.py`

**Usage:**
```bash
python3 scripts/commands/run-stage.py import    # Import map data from Overpass API
python3 scripts/commands/run-stage.py buildings # Parse buildings from map_data.xml
python3 scripts/commands/run-stage.py backend   # Build Fastify application
python3 scripts/commands/run-stage.py server    # Alias for backend
python3 scripts/commands/run-stage.py all       # Full pipeline build
```

**Features:**
- Dependency tracking using hashes
- Incremental builds (only runs necessary stages)
- Efficient build pipeline management
