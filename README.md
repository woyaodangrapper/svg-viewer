# SVG Viewer

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/woyaodangrapper/svg-viewer)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[中文文档](./README.zh-CN.md)

A powerful VS Code extension for viewing SVG and image files in a beautiful waterfall gallery layout.

## ✨ Features

- 🖼️ **Waterfall Gallery View** - Display images in an elegant masonry layout
- 🌲 **Tree View Explorer** - Browse all images in your workspace from the sidebar
- 📍 **Bottom Panel Integration** - Fixed panel view for convenient image browsing
- 🔄 **Multiple Opening Methods** - Open in editor or bottom panel
- 🎯 **Quick Actions** - Hover actions for instant access to common operations
- 📂 **Recursive Scanning** - Automatically finds images in nested folders
- 🎨 **Format Support** - SVG, PNG, JPG, JPEG, GIF, WEBP, ICO, BMP

## 📸 Screenshots

![SVG Viewer Screenshot](https://raw.githubusercontent.com/woyaodangrapper/svg-viewer/refs/heads/master/doc/screenshot.png)

> Screenshot will be added here

## 🚀 Installation

### From VSIX File

1. Download the latest `.vsix` file from [Releases](https://github.com/woyaodangrapper/svg-viewer/releases)
2. Open VS Code
3. Go to Extensions view (`Ctrl+Shift+X`)
4. Click the `...` menu at the top
5. Select `Install from VSIX...`
6. Choose the downloaded `.vsix` file

### From Source

```bash
git clone https://github.com/woyaodangrapper/svg-viewer.git
cd svg-viewer
pnpm install
pnpm run package
```

## 📖 Usage

### Sidebar Tree View

1. Click the **SVG Viewer** icon in the Activity Bar (left sidebar)
2. Browse your workspace images in the tree view
3. Click on any image or folder to open in the viewer
4. Use toolbar buttons:
   - 🔄 **Refresh** - Reload the image list
   - 🪟 **Open in Editor** - Open selected images in editor area
   - 📋 **Open in Panel** - Open selected images in bottom panel

### Context Menus

- **Right-click on files/folders** in Explorer or Editor
- Choose "Open in SVG Viewer" or "Open in SVG Viewer Panel"

### Command Palette

Press `Ctrl+Shift+P` and search for:

- `SVG Viewer: Open in SVG Viewer`
- `SVG Viewer: Open in SVG Viewer Panel`

## ⚙️ Configuration

The extension works out of the box with no configuration required.

### Supported File Types

- `.svg` - Scalable Vector Graphics
- `.png` - Portable Network Graphics
- `.jpg`, `.jpeg` - JPEG Images
- `.gif` - Graphics Interchange Format
- `.webp` - WebP Images
- `.ico` - Icon Files
- `.bmp` - Bitmap Images

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Build extension
pnpm run build

# Build webview
pnpm run build:webview

# Build all
pnpm run build:all

# Package extension
pnpm run package
```

## 📝 License

[MIT](LICENSE) © [woyaodangrapper](https://github.com/woyaodangrapper)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/woyaodangrapper/svg-viewer/issues).

## 📧 Contact

- GitHub: [@woyaodangrapper](https://github.com/woyaodangrapper)
- Issues: [svg-viewer/issues](https://github.com/woyaodangrapper/svg-viewer/issues)

---

Made with ❤️ by woyaodangrapper
