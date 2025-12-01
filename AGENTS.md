# Maps.ai Project

A comprehensive project for AI-powered mapping and location intelligence.

## Project Structure

This project is organized with a single entry point for all information:

### 📁 Documentation
- **`docs/README.md`** - Main documentation index
- **`docs/guides/`** - How-to guides and tutorials
- **`docs/knowledge/`** - Project knowledge base
- **`docs/tmp/summary.md`** - Current project status and development summary

### 🔧 Development
- **`docs/guides/aliases.md`** - Git aliases and development commands
- **`docs/guides/author_preferences.md`** - Author preferences and development guidelines
- **`AI_ASSISTANT_NOTES.md`** - Quick reference for AI assistants (read at session start)
- **`src/`** - Source code (when available)
- **`config/`** - Configuration files (when available)

## Important Note for AI Assistants

**Please read these files at the start of every session:**
1. **`docs/guides/author_preferences.md`** - Development preferences and AI command instructions
2. **`AI_ASSISTANT_NOTES.md`** - Quick reference for AI assistant workflows
3. **`docs/tmp/summary.md`** - Current project status and next steps

The `author_preferences.md` file contains essential development preferences including git command configurations to avoid pager waiting and other workflow optimizations.

**Important AI Assistant Note**: The commands `git-commit` and `git-push` described in `docs/guides/aliases.md` are instructions for AI assistants, not system commands. When the user requests these commands, the AI should perform the described workflow.

## Quick Start

### Development Commands

The project includes useful development commands defined in `docs/guides/aliases.md`:

- **`git-commit`** - AI assistant command for analyzing changes and creating meaningful commits
  - **Note for AI assistants**: This is not a system command but an instruction for the AI
  - When user says "git-commit", the AI should:
    - Check git status and analyze changes with `git --no-pager diff`
    - Create meaningful commit messages in English explaining what and why was changed
    - Stage all changes with `git add .`
    - Commit with descriptive message: `git commit -m "Title" -m "Detailed description"`
    - Verify commit with `git --no-pager log --oneline -3`

- **`git-push`** - AI assistant command for combined commit and push workflow
  - **Note for AI assistants**: This is not a system command but an instruction for the AI
  - When user says "git-push", the AI should:
    - Check for working tree changes and run git-commit workflow if needed
    - Verify commits ready for origin master with `git --no-pager log --oneline origin/master..HEAD`
    - Push commits with `git push origin master`
    - Provide comprehensive status reporting

### Getting Help

For detailed information about any aspect of the project, refer to the documentation in the `docs/` directory. All project knowledge, guides, and configuration details are accessible through this centralized structure.

**For current development status and next steps, check `docs/tmp/summary.md` at the start of each session.**

## Contributing

When working with this project:
1. Use the single entry point structure for finding information
2. Follow the established documentation patterns
3. Use the provided development commands for efficient workflow
4. Adhere to the preferences in `docs/guides/author_preferences.md`

## License

[Add appropriate license information here]