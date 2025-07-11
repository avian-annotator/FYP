#!/bin/sh
# .git/hooks/pre-commit

# Format TypeScript files using Prettier
echo "Running Prettier on TypeScript files..."
bun prettier --write "**/*.{ts,tsx}"

# Format Java files using google-java-format
echo "Running google-java-format on Java files..."
# Download google-java-format if not present
JAR_PATH="$HOME/.google-java-format/google-java-format.jar"
JAR_VERSION="1.23.0"
if [ ! -f "$JAR_PATH" ]; then
    mkdir -p "$(dirname "$JAR_PATH")"
    curl -L -o "$JAR_PATH" "https://github.com/google/google-java-format/releases/download/v$JAR_VERSION/google-java-format-$JAR_VERSION-all-deps.jar"
    chmod +x "$JAR_PATH"
fi

# Find all staged Java files and format them
git diff --cached --name-only --diff-filter=ACM | grep '\.java$' | while read -r file; do
    java -jar "$JAR_PATH" --replace "$file"
    git add "$file"
done

# Check if there are any changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit after formatting."
    exit 1
fi

exit 0