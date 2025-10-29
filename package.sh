#!/bin/bash

# Package extension for Chrome Web Store

echo "📦 Packaging GitHub Stargazer Viewer for Chrome Web Store..."

# Check if icons exist
if [ ! -f "dist/icons/icon16.png" ] || [ ! -f "dist/icons/icon48.png" ] || [ ! -f "dist/icons/icon128.png" ]; then
    echo "⚠️  WARNING: Icons not found!"
    echo "   Please create icons at:"
    echo "   - dist/icons/icon16.png (16x16 pixels)"
    echo "   - dist/icons/icon48.png (48x48 pixels)"
    echo "   - dist/icons/icon128.png (128x128 pixels)"
    echo ""
    echo "   You can use: https://favicon.io/favicon-generator/"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Copy latest files
echo "📋 Copying files to dist..."
cp manifest.json content.js vue.js dist/

# Create ZIP
echo "📦 Creating ZIP file..."
cd dist
rm -f ../github-stargazer-viewer.zip
zip -r ../github-stargazer-viewer.zip . -x "*.DS_Store" "__MACOSX/*"
cd ..

echo ""
echo "✅ Package created: github-stargazer-viewer.zip"
echo ""
echo "📤 Next steps:"
echo "   1. Go to: https://chrome.google.com/webstore/devconsole/"
echo "   2. Create a Google Developer Account ($5 fee)"
echo "   3. Click 'New Item' and upload github-stargazer-viewer.zip"
echo "   4. Fill out the listing form (see CHROME_WEB_STORE.md)"
echo ""
echo "📖 Full guide: CHROME_WEB_STORE.md"

