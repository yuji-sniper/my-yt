#!/bin/bash
set -e

URL="https://github.com/yuji-sniper/next-vibe-template/archive/refs/heads/develop.zip"
ZIP_FILE="develop.zip"
EXTRACT_DIR="next-vibe-template-develop"

# Download
curl -L -o "$ZIP_FILE" "$URL"

# Extract
unzip -o "$ZIP_FILE"

# Move contents from subdirectory to current directory
shopt -s dotglob
mv "$EXTRACT_DIR"/* .
shopt -u dotglob

# Cleanup
rmdir "$EXTRACT_DIR"
rm "$ZIP_FILE"

echo "Done!"
