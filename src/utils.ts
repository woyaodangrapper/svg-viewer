import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ImageFile, IMAGE_EXTENSIONS } from './types';

// 扫描目录获取所有图片
export async function scanDirectory(dirPath: string): Promise<ImageFile[]> {
  const images: ImageFile[] = [];

  async function scan(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

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

// 创建图片文件对象
export function createImageFile(filePath: string): ImageFile | null {
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

// 生成 Webview 内容
export function getWebviewContent(
  webview: vscode.Webview,
  context: vscode.ExtensionContext,
  images: ImageFile[]
): string {
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
  
  // 获取 VS Code 语言环境
  const locale = JSON.stringify(vscode.env.language);

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
    window.__LOCALE__ = ${locale};
  </script>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

// 生成随机 nonce
export function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
