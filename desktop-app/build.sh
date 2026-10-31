#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_NAME="AA Fourth Step Inventory"
APP_BUNDLE="$ROOT_DIR/$APP_NAME.app"

echo "=========================================================="
echo " Building Native macOS App: $APP_NAME"
echo "=========================================================="

# 1. Clean previous app bundle
echo "==> Cleaning previous build..."
rm -rf "$APP_BUNDLE"

# 2. Create bundle directory hierarchy
echo "==> Creating macOS app bundle directory structure..."
mkdir -p "$APP_BUNDLE/Contents/MacOS"
mkdir -p "$APP_BUNDLE/Contents/Resources/web/css"
mkdir -p "$APP_BUNDLE/Contents/Resources/web/js"

# 3. Generate AppIcon.icns
echo "==> Generating multi-resolution AppIcon.icns..."
python3 "$SCRIPT_DIR/src/generate_icon.py" "$APP_BUNDLE/Contents/Resources/AppIcon.icns"

# 4. Copy Info.plist and PkgInfo
echo "==> Installing Info.plist and PkgInfo..."
cp "$SCRIPT_DIR/Info.plist" "$APP_BUNDLE/Contents/Info.plist"
echo -n "APPL????" > "$APP_BUNDLE/Contents/PkgInfo"

# 5. Copy Web Application files into bundle
echo "==> Bundling web assets..."
cp "$ROOT_DIR/index.html" "$APP_BUNDLE/Contents/Resources/web/"
cp "$ROOT_DIR/css/app.css" "$APP_BUNDLE/Contents/Resources/web/css/"
cp "$ROOT_DIR/css/print.css" "$APP_BUNDLE/Contents/Resources/web/css/"
cp "$ROOT_DIR/js/bigbook-data.js" "$APP_BUNDLE/Contents/Resources/web/js/"
cp "$ROOT_DIR/js/store.js" "$APP_BUNDLE/Contents/Resources/web/js/"
cp "$ROOT_DIR/js/inventory-forms.js" "$APP_BUNDLE/Contents/Resources/web/js/"
cp "$ROOT_DIR/js/app.js" "$APP_BUNDLE/Contents/Resources/web/js/"

# 6. Compile native Cocoa/WebKit binary (Universal: arm64 + x86_64)
echo "==> Compiling native Cocoa/WebKit executable with clang (Universal arm64 + x86_64)..."
clang -O2 \
      -arch arm64 \
      -arch x86_64 \
      -framework Cocoa \
      -framework WebKit \
      -fobjc-arc \
      -mmacosx-version-min=11.0 \
      "$SCRIPT_DIR/src/main.m" \
      -o "$APP_BUNDLE/Contents/MacOS/$APP_NAME"

chmod +x "$APP_BUNDLE/Contents/MacOS/$APP_NAME"

echo "==> Signing app bundle with ad-hoc signature..."
codesign --force --deep --sign - "$APP_BUNDLE"
xattr -cr "$APP_BUNDLE" 2>/dev/null || true

echo ""
echo "=========================================================="
echo " BUILD SUCCESSFUL!"
echo " App location: $APP_BUNDLE"
echo "=========================================================="
echo "You can double-click '$APP_NAME.app' in Finder or copy it to /Applications:"
echo "  cp -R "$APP_BUNDLE" /Applications/"
echo "=========================================================="
