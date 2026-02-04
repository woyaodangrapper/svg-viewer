"use strict";
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
function activate(context) {
  const disposable = vscode__namespace.commands.registerCommand("SVGViewer.open", async (uri) => {
    let targetPath;
    if (uri) {
      targetPath = uri.fsPath;
    } else {
      const activeEditor = vscode__namespace.window.activeTextEditor;
      if (activeEditor) {
        targetPath = activeEditor.document.uri.fsPath;
      } else {
        vscode__namespace.window.showErrorMessage("No file or folder selected");
        return;
      }
    }
    const stat = fs__namespace.statSync(targetPath);
    let images = [];
    if (stat.isDirectory()) {
      images = await scanDirectory(targetPath);
    } else {
      path__namespace.extname(targetPath).toLowerCase();
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
          vscode__namespace.Uri.file(path__namespace.dirname(targetPath))
        ]
      }
    );
    panel.webview.onDidReceiveMessage(
      (message) => {
        console.log("Extension received message:", message);
        if (message.command === "open-svg") {
          const svgUri = vscode__namespace.Uri.file(message.path);
          openSvgInEditor(svgUri);
        }
        if (message.command === "open-web") {
          vscode__namespace.env.openExternal(vscode__namespace.Uri.parse(message.url));
        }
        if (message.command === "go-to-svg") {
          const svgUri = vscode__namespace.Uri.file(message.path);
          openSvgInLocate(svgUri);
        }
      },
      void 0,
      context.subscriptions
    );
    panel.webview.html = getWebviewContent(panel.webview, context, images);
  });
  context.subscriptions.push(disposable);
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
async function scanDirectory(dirPath, context) {
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
function createImageFile(filePath, context) {
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
function deactivate() {
}
exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
