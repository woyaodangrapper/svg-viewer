import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { ImageFile } from './types';
import { scanDirectory, createImageFile, getWebviewContent } from './utils';
import { handleWebviewMessage } from './messageHandlers';
import { ImageTreeItem, ImageTreeDataProvider } from './treeView';
import { SVGViewerPanelProvider } from './panelProvider';

export function activate(context: vscode.ExtensionContext) {
  // 注册树视图数据提供者
  const treeDataProvider = new ImageTreeDataProvider(context);
  const treeView = vscode.window.createTreeView('svgViewer.imageTree', {
    treeDataProvider
  });
  context.subscriptions.push(treeView);

  // 注册底部 Panel Provider
  const panelProvider = new SVGViewerPanelProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SVGViewerPanelProvider.viewType,
      panelProvider,
      {
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    )
  );

  // 刷新命令
  const refreshDisposable = vscode.commands.registerCommand('SVGViewer.refresh', () => {
    treeDataProvider.refresh();
  });

  // 原有的命令：在编辑器区域打开 WebviewPanel
  const disposable = vscode.commands.registerCommand('SVGViewer.open', async (uri: vscode.Uri) => {
    let targetPath: string;

    if (uri) {
      targetPath = uri.fsPath;
    } else {
      // 如果没有传入 URI，尝试从当前选中的树节点或活动编辑器获取
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        targetPath = activeEditor.document.uri.fsPath;
      } else if (vscode.workspace.workspaceFolders?.[0]) {
        targetPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      } else {
        vscode.window.showErrorMessage(vscode.l10n.t('error.noSelection'));
        return;
      }
    }

    await openInViewer(targetPath, context);
  });

  // 从树视图打开
  const openFromTreeDisposable = vscode.commands.registerCommand('SVGViewer.openFromTree', async (arg: vscode.Uri | ImageTreeItem) => {
    let targetPath: string | undefined;

    if (arg instanceof vscode.Uri) {
      targetPath = arg.fsPath;
    } else if (arg && typeof arg === 'object' && 'nodePath' in arg) {
      // 从树节点右键菜单调用
      targetPath = (arg as ImageTreeItem).nodePath;
    } else if (arg && typeof arg === 'object' && 'fsPath' in arg) {
      // 兼容其他 URI 类似对象
      targetPath = (arg as { fsPath: string }).fsPath;
    }

    if (targetPath) {
      await openInViewer(targetPath, context);
    } else {
      vscode.window.showErrorMessage(vscode.l10n.t('error.noSelection'));
    }
  });

  // 新命令：在底部 Panel 中打开
  const openInPanelDisposable = vscode.commands.registerCommand('SVGViewer.openInPanel', async (uri: vscode.Uri) => {
    let targetPath: string;

    if (uri) {
      targetPath = uri.fsPath;
    } else {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        targetPath = activeEditor.document.uri.fsPath;
      } else if (vscode.workspace.workspaceFolders?.[0]) {
        targetPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
      } else {
        vscode.window.showErrorMessage(vscode.l10n.t('error.noSelection'));
        return;
      }
    }

    await openInPanel(targetPath, context, panelProvider);
  });

  // 从树视图在 Panel 中打开
  const openInPanelFromTreeDisposable = vscode.commands.registerCommand('SVGViewer.openInPanelFromTree', async (arg: vscode.Uri | ImageTreeItem) => {
    let targetPath: string | undefined;

    if (arg instanceof vscode.Uri) {
      targetPath = arg.fsPath;
    } else if (arg && typeof arg === 'object' && 'nodePath' in arg) {
      // 从树节点右键菜单调用
      targetPath = (arg as ImageTreeItem).nodePath;
    } else if (arg && typeof arg === 'object' && 'fsPath' in arg) {
      // 兼容其他 URI 类似对象
      targetPath = (arg as { fsPath: string }).fsPath;
    }

    if (targetPath) {
      await openInPanel(targetPath, context, panelProvider);
    } else {
      vscode.window.showErrorMessage('No file or folder selected');
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

// 在编辑器区域打开查看器
async function openInViewer(targetPath: string, context: vscode.ExtensionContext) {
  const stat = fs.statSync(targetPath);
  let images: ImageFile[] = [];

  if (stat.isDirectory()) {
    images = await scanDirectory(targetPath);
  } else {
    const imageFile = createImageFile(targetPath);
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
        vscode.Uri.file(stat.isDirectory() ? targetPath : path.dirname(targetPath))
      ]
    }
  );

  // 使用统一的消息处理
  panel.webview.onDidReceiveMessage(
    message => handleWebviewMessage(message),
    undefined,
    context.subscriptions
  );

  panel.webview.html = getWebviewContent(panel.webview, context, images);
}

// 在底部 Panel 中打开
async function openInPanel(targetPath: string, context: vscode.ExtensionContext, panelProvider: SVGViewerPanelProvider) {
  const stat = fs.statSync(targetPath);
  let images: ImageFile[] = [];

  if (stat.isDirectory()) {
    images = await scanDirectory(targetPath);
  } else {
    const imageFile = createImageFile(targetPath);
    if (imageFile) {
      images = [imageFile];
    }
  }

  if (images.length === 0) {
    vscode.window.showInformationMessage('No images found in the selected location');
    return;
  }

  // 更新底部 Panel 的内容
  const rootPath = stat.isDirectory() ? targetPath : path.dirname(targetPath);
  panelProvider.updateImages(images, rootPath);

  // 聚焦到底部 Panel
  vscode.commands.executeCommand('svgViewer.panelView.focus');
}

export function deactivate() { }
