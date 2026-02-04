# SVG Viewer

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/woyaodangrapper/svg-viewer)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[English](./README.md)

一个强大的 VS Code 扩展，用于在精美的瀑布流画廊布局中查看 SVG 和图片文件。

## ✨ 功能特性

- 🖼️ **瀑布流画廊视图** - 以优雅的瀑布流布局展示图片
- 🌲 **树形视图浏览器** - 从侧边栏浏览工作区中的所有图片
- 📍 **底部面板集成** - 固定面板视图，方便浏览图片
- 🔄 **多种打开方式** - 可在编辑器或底部面板打开
- 🎯 **快速操作** - 悬停操作可即时访问常用功能
- 📂 **递归扫描** - 自动查找嵌套文件夹中的图片
- 🎨 **格式支持** - SVG、PNG、JPG、JPEG、GIF、WEBP、ICO、BMP

## 📸 截图展示

![SVG Viewer 截图](https://raw.githubusercontent.com/woyaodangrapper/svg-viewer/refs/heads/master/doc/screenshot-zh.png)

> 截图将添加在此处

## 🚀 安装方法

### 从 VSIX 文件安装

1. 从 [Releases](https://github.com/woyaodangrapper/svg-viewer/releases) 下载最新的 `.vsix` 文件
2. 打开 VS Code
3. 进入扩展视图 (`Ctrl+Shift+X`)
4. 点击顶部的 `...` 菜单
5. 选择 `从 VSIX 安装...`
6. 选择下载的 `.vsix` 文件

### 从源码安装

```bash
git clone https://github.com/woyaodangrapper/svg-viewer.git
cd svg-viewer
pnpm install
pnpm run package
```

## 📖 使用说明

### 侧边栏树形视图

1. 点击活动栏（左侧边栏）中的 **SVG Viewer** 图标
2. 在树形视图中浏览工作区图片
3. 点击任意图片或文件夹在查看器中打开
4. 使用工具栏按钮：
   - 🔄 **刷新** - 重新加载图片列表
   - 🪟 **在编辑器中打开** - 在编辑器区域打开选中的图片
   - 📋 **在面板中打开** - 在底部面板打开选中的图片

### 右键菜单

- 在资源管理器或编辑器中**右键点击文件/文件夹**
- 选择"在 SVG 查看器中打开"或"在底部面板打开 SVG 查看器"

### 命令面板

按 `Ctrl+Shift+P` 并搜索：

- `SVG Viewer: 在 SVG 查看器中打开`
- `SVG Viewer: 在底部面板打开 SVG 查看器`

## ⚙️ 配置

该扩展开箱即用，无需任何配置。

### 支持的文件类型

- `.svg` - 可缩放矢量图形
- `.png` - 便携式网络图形
- `.jpg`, `.jpeg` - JPEG 图片
- `.gif` - 图形交换格式
- `.webp` - WebP 图片
- `.ico` - 图标文件
- `.bmp` - 位图图片

## 🛠️ 开发

```bash
# 安装依赖
pnpm install

# 构建扩展
pnpm run build

# 构建 webview
pnpm run build:webview

# 构建全部
pnpm run build:all

# 打包扩展
pnpm run package
```

## 📝 许可证

[MIT](LICENSE) © [woyaodangrapper](https://github.com/woyaodangrapper)

## 🤝 贡献

欢迎贡献、提出问题和功能请求！

随时查看 [issues 页面](https://github.com/woyaodangrapper/svg-viewer/issues)。

## 📧 联系方式

- GitHub: [@woyaodangrapper](https://github.com/woyaodangrapper)
- Issues: [svg-viewer/issues](https://github.com/woyaodangrapper/svg-viewer/issues)

---

用 ❤️ 制作 by woyaodangrapper
