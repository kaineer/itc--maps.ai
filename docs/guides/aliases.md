# Git Aliases and Commands

## git-commit (ai-assist command)

A command for ai-assist that automatically analyzes git changes and generates meaningful commit messages in English.

### Command Definition

```bash
git-commit() {
    echo "Analyzing git changes..."
    
    # Get staged changes or add all if nothing staged
    if [ -z "$(git diff --staged)" ]; then
        echo "No staged changes found. Adding all changes..."
        git add .
    fi
    
    # Check if there are any changes to commit
    if [ -z "$(git diff --staged)" ]; then
        echo "No changes to commit."
        return 1
    fi
    
    # Get detailed information about changes
    CHANGED_FILES=$(git diff --staged --name-only)
    FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l | tr -d ' ')
    
    echo "Found $FILE_COUNT changed file(s):"
    echo "$CHANGED_FILES"
    echo ""
    
    # Generate meaningful commit message based on file changes
    COMMIT_MSG=$(generate_commit_message "$CHANGED_FILES")
    
    echo "Generated commit message:"
    echo "$COMMIT_MSG"
    echo ""
    
    # Create the commit
    git commit -m "$COMMIT_MSG"
    
    echo "✅ Commit created successfully!"
}

generate_commit_message() {
    local files="$1"
    local message=""
    
    # Analyze file types and patterns
    if echo "$files" | grep -q "\.ts$\|\.tsx$\|\.js$\|\.jsx$"; then
        message="Update TypeScript/JavaScript components"
        if echo "$files" | grep -q "\.test\.\|\.spec\."; then
            message="$message and tests"
        fi
    elif echo "$files" | grep -q "\.css$\|\.scss$\|\.sass$"; then
        message="Update styles and design system"
    elif echo "$files" | grep -q "\.md$"; then
        message="Update documentation"
    elif echo "$files" | grep -q "\.json$"; then
        message="Update configuration"
    else
        message="Update project files"
    fi
    
    # Add context based on file paths
    if echo "$files" | grep -q "src/"; then
        message="$message in source code"
    elif echo "$files" | grep -q "docs/"; then
        message="$message in documentation"
    elif echo "$files" | grep -q "config/"; then
        message="$message in configuration"
    fi
    
    # Add timestamp for uniqueness
    local timestamp=$(date +"%Y-%m-%d %H:%M")
    message="$message - $timestamp"
    
    echo "$message"
}
```

### Usage

Add this function to your shell configuration (`.bashrc`, `.zshrc`, etc.) and then use:

```bash
git-commit
```

### Features

- **Automatic staging**: Adds all changes if nothing is staged
- **Meaningful messages**: Generates context-aware commit messages in English
- **File type analysis**: Understands different file types (TypeScript, CSS, docs, etc.)
- **Path context**: Adds context based on file locations (src/, docs/, config/)
- **Timestamp**: Includes timestamp for uniqueness

### Example Output

```
Analyzing git changes...
No staged changes found. Adding all changes...
Found 3 changed file(s):
src/components/Button.tsx
src/styles/components.css
docs/guides/aliases.md

Generated commit message:
Update TypeScript/JavaScript components and styles in source code - 2024-01-15 14:30

✅ Commit created successfully!
```

### Integration with ai-assist

This command is designed to work seamlessly with ai-assist by providing:
- Clear, human-readable output
- Meaningful commit messages that describe the actual changes
- Automatic handling of git staging
- Error handling and user feedback

### Notes

- The command prioritizes meaningful descriptions over line count statistics
- Messages are generated based on file types and locations
- Suitable for daily development workflow
- Can be extended with more sophisticated AI-based message generation