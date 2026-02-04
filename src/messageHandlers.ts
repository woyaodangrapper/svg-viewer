import * as vscode from 'vscode';

// 消息处理接口
export interface WebviewMessage {
  command: string;
  path?: string;
  url?: string;
}

// 在资源管理器中定位文件
export function openSvgInLocate(svgUri: vscode.Uri) {
  const uri = vscode.Uri.file(svgUri.fsPath);

  vscode.commands.executeCommand('revealInExplorer', uri).then(undefined, err => {
    vscode.window.showErrorMessage(`无法定位 SVG: ${err}`);
  });
}

// 在编辑器中打开文件
export function openSvgInEditor(svgUri: vscode.Uri) {
  vscode.workspace.openTextDocument(svgUri).then(doc => {
    vscode.window.showTextDocument(doc, {
      preview: false,  // 如果为 true，重复打开同一个文件会复用 tab
      viewColumn: vscode.ViewColumn.One // 打开在第一个编辑器列
    });
  }, err => {
    vscode.window.showErrorMessage(`无法打开 SVG: ${err}`);
  });
}

// 统一的消息处理函数
export function handleWebviewMessage(message: WebviewMessage) {
  console.log('Received message:', message);

  switch (message.command) {
    case 'open-svg':
      if (message.path) {
        const svgUri = vscode.Uri.file(message.path);
        openSvgInEditor(svgUri);
      }
      break;

    case 'open-web':
      if (message.url) {
        vscode.env.openExternal(vscode.Uri.parse(message.url));
      }
      break;

    case 'go-to-svg':
      if (message.path) {
        const svgUri = vscode.Uri.file(message.path);
        openSvgInLocate(svgUri);
      }
      break;
  }
}
