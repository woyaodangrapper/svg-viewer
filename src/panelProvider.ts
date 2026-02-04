import * as vscode from 'vscode';
import * as path from 'path';
import { ImageFile } from './types';
import { getWebviewContent } from './utils';
import { handleWebviewMessage } from './messageHandlers';

// 底部 Panel 的 WebviewViewProvider
export class SVGViewerPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'svgViewer.panelView';
  private _view?: vscode.WebviewView;
  private _images: ImageFile[] = [];

  constructor(private readonly _context: vscode.ExtensionContext) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._context.extensionPath, 'dist')),
        ...(vscode.workspace.workspaceFolders?.map(f => f.uri) || [])
      ]
    };

    // 设置消息处理
    webviewView.webview.onDidReceiveMessage(
      message => handleWebviewMessage(message),
      undefined,
      this._context.subscriptions
    );

    // 初始化时显示空状态或已有的图片
    this._updateWebview();
  }

  // 更新 Panel 中显示的图片
  public updateImages(images: ImageFile[], rootPath: string) {
    this._images = images;

    if (this._view) {
      // 更新 localResourceRoots 以包含新的路径
      this._view.webview.options = {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._context.extensionPath, 'dist')),
          vscode.Uri.file(rootPath),
          ...(vscode.workspace.workspaceFolders?.map(f => f.uri) || [])
        ]
      };
      this._updateWebview();
      this._view.show?.(true); // 显示 panel
    }
  }

  private _updateWebview() {
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
  public get view(): vscode.WebviewView | undefined {
    return this._view;
  }
}
