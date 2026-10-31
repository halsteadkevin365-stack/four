#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
APP_PATH="$DIR/AA Fourth Step Inventory.app"

echo "Launching 4th Step Moral Inventory..."
xattr -cr "$APP_PATH" 2>/dev/null || true

# Try opening via macOS LaunchServices
if open "$APP_PATH" 2>/dev/null; then
    echo "App launched successfully!"
    exit 0
fi

# Fallback: run binary directly
echo "Launching directly via binary..."
"$APP_PATH/Contents/MacOS/AA Fourth Step Inventory"
