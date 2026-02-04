import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.bmp'];

interface ImageFile {
  name: string;
  path: string;
  uri: string;
  type: 'svg' | 'image';
  extension: string;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('SVGViewer.open', async (uri: vscode.Uri) => {
    let targetPath: string;

    if (uri) {
      targetPath = uri.fsPath;
    } else {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        targetPath = activeEditor.document.uri.fsPath;
      } else {
        vscode.window.showErrorMessage('No file or folder selected');
        return;
      }
    }

    const stat = fs.statSync(targetPath);
    let images: ImageFile[] = [];

    if (stat.isDirectory()) {
      images = await scanDirectory(targetPath, context);
    } else {
      const ext = path.extname(targetPath).toLowerCase();
      const imageFile = createImageFile(targetPath, context);
      if (imageFile) {
        images = [imageFile];
      }
    }

    if (images.length === 0) {
      vscode.window.showInformationMessage('No images found in the selected location');
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'svgViewer',
      `Image Viewer - ${path.basename(targetPath)}`,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'dist')),
          vscode.Uri.file(path.dirname(targetPath))
        ]
      }
    );

    panel.webview.onDidReceiveMessage(
      message => {
        console.log('Extension received message:', message);
        if (message.command === 'open-svg') {
          const svgUri = vscode.Uri.file(message.path);
          openSvgInEditor(svgUri);
        }
        if (message.command === 'open-web') {
          vscode.env.openExternal(vscode.Uri.parse(message.url));
        }
        if (message.command === 'go-to-svg') {
          const svgUri = vscode.Uri.file(message.path);
          openSvgInLocate(svgUri);
        }
      },
      undefined,
      context.subscriptions
    );

    panel.webview.html = getWebviewContent(panel.webview, context, images);
  });

  context.subscriptions.push(disposable);
}
function openSvgInLocate(svgUri: vscode.Uri) {
  const uri = vscode.Uri.file(svgUri.fsPath);

  vscode.commands.executeCommand('revealInExplorer', uri).then(undefined, err => {
    vscode.window.showErrorMessage(`无法定位 SVG: ${err}`);
  });
}
function openSvgInEditor(svgUri: vscode.Uri) {
  vscode.workspace.openTextDocument(svgUri).then(doc => {
    vscode.window.showTextDocument(doc, {
      preview: false,  // 如果为 true，重复打开同一个文件会复用 tab
      viewColumn: vscode.ViewColumn.One // 打开在第一个编辑器列
    });
  }, err => {
    vscode.window.showErrorMessage(`无法打开 SVG: ${err}`);
  });
}

async function scanDirectory(dirPath: string, context: vscode.ExtensionContext): Promise<ImageFile[]> {
  const images: ImageFile[] = [];

  async function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const imageFile = createImageFile(fullPath, context);
        if (imageFile) {
          images.push(imageFile);
        }
      }
    }
  }

  await scan(dirPath);
  return images;
}

function createImageFile(filePath: string, context: vscode.ExtensionContext): ImageFile | null {
  const ext = path.extname(filePath).toLowerCase();

  if (IMAGE_EXTENSIONS.includes(ext)) {
    return {
      name: path.basename(filePath),
      path: filePath,
      uri: filePath,
      type: ext === '.svg' ? 'svg' : 'image',
      extension: ext.slice(1)
    };
  }

  return null;
}

function getWebviewContent(webview: vscode.Webview, context: vscode.ExtensionContext, images: ImageFile[]): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview', 'index.js'))
  );
  const styleUri = webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'webview', 'index.css'))
  );

  // 转换图片路径为 webview URI
  const imagesWithUri = images.map(img => ({
    ...img,
    uri: webview.asWebviewUri(vscode.Uri.file(img.path)).toString()
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
  </script>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function deactivate() { }
