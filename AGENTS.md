# Maps.ai Project

A comprehensive project for AI-powered mapping and location intelligence.

## Project Structure

This project is organized with a single entry point for all information:

### 📁 Documentation
- **`docs/README.md`** - Main documentation index
- **`docs/guides/`** - How-to guides and tutorials
- **`docs/knowledge/`** - Project knowledge base

### 🔧 Development
- **`docs/guides/aliases.md`** - Git aliases and development commands
- **`docs/guides/author_preferences.md`** - Author preferences and development guidelines
- **`src/`** - Source code (when available)
- **`config/`** - Configuration files (when available)

## Important Note for AI Assistants

**Please read `docs/guides/author_preferences.md` at the start of every session.** This file contains essential development preferences including git command configurations to avoid pager waiting and other workflow optimizations.

## Quick Start

### Development Commands

The project includes useful development commands defined in `docs/guides/aliases.md`:

- **`git-commit`** - Automatically analyze changes and create meaningful commits
  - Analyzes staged changes or adds all files automatically
  - Generates context-aware commit messages in English
  - Handles different file types (TypeScript, CSS, docs, etc.)
  - Provides clear feedback and error handling

- **`git-push`** - Combined commit and push workflow
  - Checks for working tree changes and runs git-commit if needed
  - Verifies commits ready for origin master and pushes them
  - Provides comprehensive status reporting

### Getting Help

For detailed information about any aspect of the project, refer to the documentation in the `docs/` directory. All project knowledge, guides, and configuration details are accessible through this centralized structure.

## Contributing

When working with this project:
1. Use the single entry point structure for finding information
2. Follow the established documentation patterns
3. Use the provided development commands for efficient workflow
4. Adhere to the preferences in `docs/guides/author_preferences.md`

## License

[Add appropriate license information here]