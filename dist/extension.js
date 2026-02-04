"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const vscode__namespace = /* @__PURE__ */ _interopNamespaceDefault(vscode);
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const IMAGE_EXTENSIONS = [".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp"];
async function scanDirectory(dirPath) {
  const images = [];
  async function scan(dir) {
    const entries = fs__namespace.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path__namespace.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const imageFile = createImageFile(fullPath);
        if (imageFile) {
          images.push(imageFile);
        }
      }
    }
  }
  await scan(dirPath);
  return images;
}
function createImageFile(filePath) {
  const ext = path__namespace.extname(filePath).toLowerCase();
  if (IMAGE_EXTENSIONS.includes(ext)) {
    return {
      name: path__namespace.basename(filePath),
      path: filePath,
      uri: filePath,
      type: ext === ".svg" ? "svg" : "image",
      extension: ext.slice(1)
    };
  }
  return null;
}
function getWebviewContent(webview, context, images) {
  const scriptUri = webview.asWebviewUri(
    vscode__namespace.Uri.file(path__namespace.join(context.extensionPath, "dist", "webview", "index.js"))
  );
  const styleUri = webview.asWebviewUri(
    vscode__namespace.Uri.file(path__namespace.join(context.extensionPath, "dist", "webview", "index.css"))
  );
  const imagesWithUri = images.map((img) => ({
    ...img,
    uri: webview.asWebviewUri(vscode__namespace.Uri.file(img.path)).toString()
  }));
  const nonce = getNonce();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data: https:; font-src ${webview.cspSource};">
  <link rel="stylesheet" href="${styleUri}">
  <title>Image Viewer</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}">
    window.__IMAGES__ = ${JSON.stringify(imagesWithUri)};
  <\/script>
  <script nonce="${nonce}" src="${scriptUri}"><\/script>
</body>
</html>`;
}
function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function openSvgInLocate(svgUri) {
  const uri = vscode__namespace.Uri.file(svgUri.fsPath);
  vscode__namespace.commands.executeCommand("revealInExplorer", uri).then(void 0, (err) => {
    vscode__namespace.window.showErrorMessage(`无法定位 SVG: ${err}`);
  });
}
function openSvgInEditor(svgUri) {
  vscode__namespace.workspace.openTextDocument(svgUri).then((doc) => {
    vscode__namespace.window.showTextDocument(doc, {
      preview: false,
      // 如果为 true，重复打开同一个文件会复用 tab
      viewColumn: vscode__namespace.ViewColumn.One
      // 打开在第一个编辑器列
    });
  }, (err) => {
    vscode__namespace.window.showErrorMessage(`无法打开 SVG: ${err}`);
  });
}
function handleWebviewMessage(message) {
  console.log("Received message:", message);
  switch (message.command) {
    case "open-svg":
      if (message.path) {
        const svgUri = vscode__namespace.Uri.file(message.path);
        openSvgInEditor(svgUri);
      }
      break;
    case "open-web":
      if (message.url) {
        vscode__namespace.env.openExternal(vscode__namespace.Uri.parse(message.url));
      }
      break;
    case "go-to-svg":
      if (message.path) {
        const svgUri = vscode__namespace.Uri.file(message.path);
        openSvgInLocate(svgUri);
      }
      break;
  }
}
class ImageTreeItem extends vscode__namespace.TreeItem {
  constructor(label, collapsibleState, nodePath, nodeType, imageCount) {
    super(label, collapsibleState);
    this.label = label;
    this.collapsibleState = collapsibleState;
    this.nodePath = nodePath;
    this.nodeType = nodeType;
    this.imageCount = imageCount;
    this.contextValue = nodeType;
    this.tooltip = nodePath;
    if (nodeType === "folder") {
      this.iconPath = new vscode__namespace.ThemeIcon("folder");
      this.description = imageCount ? `${imageCount} images` : "";
    } else {
      const ext = path__namespace.extname(nodePath).toLowerCase();
      if (ext === ".svg") {
        this.iconPath = new vscode__namespace.ThemeIcon("symbol-misc");
      } else {
        this.iconPath = new vscode__namespace.ThemeIcon("file-media");
      }
      this.description = ext.slice(1).toUpperCase();
      this.command = {
        command: "SVGViewer.openFromTree",
        title: "Open in SVG Viewer",
        arguments: [vscode__namespace.Uri.file(nodePath)]
      };
    }
    this.resourceUri = vscode__namespace.Uri.file(nodePath);
  }
}
class ImageTreeDataProvider {
  constructor(context) {
    __publicField(this, "_onDidChangeTreeData", new vscode__namespace.EventEmitter());
    __publicField(this, "onDidChangeTreeData", this._onDidChangeTreeData.event);
    __publicField(this, "_imageCache", /* @__PURE__ */ new Map());
    this.context = context;
  }
  refresh() {
    this._imageCache.clear();
    this._onDidChangeTreeData.fire();
  }
  getTreeItem(element) {
    return element;
  }
  async getChildren(element) {
    if (!vscode__namespace.workspace.workspaceFolders) {
      return [];
    }
    if (!element) {
      const items = [];
      for (const folder of vscode__namespace.workspace.workspaceFolders) {
        const images = await this.scanDirectoryForTree(folder.uri.fsPath);
        if (images.length > 0) {
          items.push(new ImageTreeItem(
            folder.name,
            vscode__namespace.TreeItemCollapsibleState.Expanded,
            folder.uri.fsPath,
            "folder",
            images.length
          ));
          this._imageCache.set(folder.uri.fsPath, images);
        }
      }
      return items;
    }
    if (element.nodeType === "folder") {
      return this.getChildrenForFolder(element.nodePath);
    }
    return [];
  }
  async getChildrenForFolder(folderPath) {
    const items = [];
    const entries = fs__namespace.readdirSync(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
        const subPath = path__namespace.join(folderPath, entry.name);
        const images = await this.scanDirectoryForTree(subPath);
        if (images.length > 0) {
          items.push(new ImageTreeItem(
            entry.name,
            vscode__namespace.TreeItemCollapsibleState.Collapsed,
            subPath,
            "folder",
            images.length
          ));
          this._imageCache.set(subPath, images);
        }
      }
    }
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path__namespace.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const filePath = path__namespace.join(folderPath, entry.name);
          items.push(new ImageTreeItem(
            entry.name,
            vscode__namespace.TreeItemCollapsibleState.None,
            filePath,
            "imageFile"
          ));
        }
      }
    }
    return items;
  }
  async scanDirectoryForTree(dirPath) {
    const images = [];
    const scan = (dir) => {
      try {
        const entries = fs__namespace.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path__namespace.join(dir, entry.name);
          if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
            scan(fullPath);
          } else if (entry.isFile()) {
            const ext = path__namespace.extname(entry.name).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
              images.push({
                name: entry.name,
                path: fullPath,
                uri: fullPath,
                type: ext === ".svg" ? "svg" : "image",
                extension: ext.slice(1)
              });
            }
          }
        }
      } catch (e) {
      }
    };
    scan(dirPath);
    return images;
  }
  // 获取指定文件夹下的所有图片
  getImagesForPath(folderPath) {
    return this._imageCache.get(folderPath) || [];
  }
}
class SVGViewerPanelProvider {
  constructor(_context) {
    __publicField(this, "_view");
    __publicField(this, "_images", []);
    this._context = _context;
  }
  resolveWebviewView(webviewView, _context, _token) {
    var _a;
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode__namespace.Uri.file(path__namespace.join(this._context.extensionPath, "dist")),
        ...((_a = vscode__namespace.workspace.workspaceFolders) == null ? void 0 : _a.map((f) => f.uri)) || []
      ]
    };
    webviewView.webview.onDidReceiveMessage(
      (message) => handleWebviewMessage(message),
      void 0,
      this._context.subscriptions
    );
    this._updateWebview();
  }
  // 更新 Panel 中显示的图片
  updateImages(images, rootPath) {
    var _a, _b, _c;
    this._images = images;
    if (this._view) {
      this._view.webview.options = {
        enableScripts: true,
        localResourceRoots: [
          vscode__namespace.Uri.file(path__namespace.join(this._context.extensionPath, "dist")),
          vscode__namespace.Uri.file(rootPath),
          ...((_a = vscode__namespace.workspace.workspaceFolders) == null ? void 0 : _a.map((f) => f.uri)) || []
        ]
      };
      this._updateWebview();
      (_c = (_b = this._view).show) == null ? void 0 : _c.call(_b, true);
    }
  }
  _updateWebview() {
    if (!this._view) {
      return;
    }
    this._view.webview.html = getWebviewContent(
      this._view.webview,
      this._context,
      this._images
    );
  }
  // 获取当前 view
  get view() {
    return this._view;
  }
}
__publicField(SVGViewerPanelProvider, "viewType", "svgViewer.panelView");
function activate(context) {
  const treeDataProvider = new ImageTreeDataProvider(context);
  const treeView = vscode__namespace.window.createTreeView("svgViewer.imageTree", {
    treeDataProvider
  });
  context.subscriptions.push(treeView);
  const panelProvider = new SVGViewerPanelProvider(context);
  context.subscriptions.push(
    vscode__namespace.window.registerWebviewViewProvider(
      SVGViewerPanelProvider.viewType,
      panelProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );
  const refreshDisposable = vscode__namespace.commands.registerCommand("SVGViewer.refresh", () => {
    treeDataProvider.refresh();
  });
  const disposable = vscode__namespace.commands.registerCommand("SVGViewer.open", async (uri) => {
    var _a;
    let targetPath;
    if (uri) {
      targetPath = uri.fsPath;
    } else {
      const activeEditor = vscode__namespace.window.activeTextEditor;
      if (activeEditor) {
        targetPath = activeEditor.document.uri.fsPath;
      } else if ((_a = vscode__namespace.workspace.workspaceFolders) == null ? void 0 : _a[0]) {
        targetPath = vscode__namespace.workspace.workspaceFolders[0].uri.fsPath;
      } else {
        vscode__namespace.window.showErrorMessage("No file or folder selected");
        return;
      }
    }
    await openInViewer(targetPath, context);
  });
  const openFromTreeDisposable = vscode__namespace.commands.registerCommand("SVGViewer.openFromTree", async (arg) => {
    let targetPath;
    if (arg instanceof vscode__namespace.Uri) {
      targetPath = arg.fsPath;
    } else if (arg && typeof arg === "object" && "nodePath" in arg) {
      targetPath = arg.nodePath;
    } else if (arg && typeof arg === "object" && "fsPath" in arg) {
      targetPath = arg.fsPath;
    }
    if (targetPath) {
      await openInViewer(targetPath, context);
    } else {
      vscode__namespace.window.showErrorMessage("No file or folder selected");
    }
  });
  const openInPanelDisposable = vscode__namespace.commands.registerCommand("SVGViewer.openInPanel", async (uri) => {
    var _a;
    let targetPath;
    if (uri) {
      targetPath = uri.fsPath;
    } else {
      const activeEditor = vscode__namespace.window.activeTextEditor;
      if (activeEditor) {
        targetPath = activeEditor.document.uri.fsPath;
      } else if ((_a = vscode__namespace.workspace.workspaceFolders) == null ? void 0 : _a[0]) {
        targetPath = vscode__namespace.workspace.workspaceFolders[0].uri.fsPath;
      } else {
        vscode__namespace.window.showErrorMessage("No file or folder selected");
        return;
      }
    }
    await openInPanel(targetPath, context, panelProvider);
  });
  const openInPanelFromTreeDisposable = vscode__namespace.commands.registerCommand("SVGViewer.openInPanelFromTree", async (arg) => {
    let targetPath;
    if (arg instanceof vscode__namespace.Uri) {
      targetPath = arg.fsPath;
    } else if (arg && typeof arg === "object" && "nodePath" in arg) {
      targetPath = arg.nodePath;
    } else if (arg && typeof arg === "object" && "fsPath" in arg) {
      targetPath = arg.fsPath;
    }
    if (targetPath) {
      await openInPanel(targetPath, context, panelProvider);
    } else {
      vscode__namespace.window.showErrorMessage("No file or folder selected");
    }
  });
  context.subscriptions.push(
    disposable,
    refreshDisposable,
    openFromTreeDisposable,
    openInPanelDisposable,
    openInPanelFromTreeDisposable
  );
}
async function openInViewer(targetPath, context) {
  const stat = fs__namespace.statSync(targetPath);
  let images = [];
  if (stat.isDirectory()) {
    images = await scanDirectory(targetPath);
  } else {
    const imageFile = createImageFile(targetPath);
    if (imageFile) {
      images = [imageFile];
    }
  }
  if (images.length === 0) {
    vscode__namespace.window.showInformationMessage("No images found in the selected location");
    return;
  }
  const panel = vscode__namespace.window.createWebviewPanel(
    "svgViewer",
    `Image Viewer - ${path__namespace.basename(targetPath)}`,
    vscode__namespace.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode__namespace.Uri.file(path__namespace.join(context.extensionPath, "dist")),
        vscode__namespace.Uri.file(stat.isDirectory() ? targetPath : path__namespace.dirname(targetPath))
      ]
    }
  );
  panel.webview.onDidReceiveMessage(
    (message) => handleWebviewMessage(message),
    void 0,
    context.subscriptions
  );
  panel.webview.html = getWebviewContent(panel.webview, context, images);
}
async function openInPanel(targetPath, context, panelProvider) {
  const stat = fs__namespace.statSync(targetPath);
  let images = [];
  if (stat.isDirectory()) {
    images = await scanDirectory(targetPath);
  } else {
    const imageFile = createImageFile(targetPath);
    if (imageFile) {
      images = [imageFile];
    }
  }
  if (images.length === 0) {
    vscode__namespace.window.showInformationMessage("No images found in the selected location");
    return;
  }
  const rootPath = stat.isDirectory() ? targetPath : path__namespace.dirname(targetPath);
  panelProvider.updateImages(images, rootPath);
  vscode__namespace.commands.executeCommand("svgViewer.panelView.focus");
}
function deactivate() {
}
exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
