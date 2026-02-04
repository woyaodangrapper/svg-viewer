import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ImageFile, TreeNodeType, IMAGE_EXTENSIONS } from './types';

// 树节点
export class ImageTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly nodePath: string,
    public readonly nodeType: TreeNodeType,
    public readonly imageCount?: number
  ) {
    super(label, collapsibleState);

    this.contextValue = nodeType;
    this.tooltip = nodePath;

    if (nodeType === 'folder') {
      this.iconPath = new vscode.ThemeIcon('folder');
      this.description = imageCount ? `${imageCount} images` : '';
    } else {
      const ext = path.extname(nodePath).toLowerCase();
      if (ext === '.svg') {
        this.iconPath = new vscode.ThemeIcon('symbol-misc');
      } else {
        this.iconPath = new vscode.ThemeIcon('file-media');
      }
      this.description = ext.slice(1).toUpperCase();
      this.command = {
        command: 'SVGViewer.openFromTree',
        title: 'Open in SVG Viewer',
        arguments: [vscode.Uri.file(nodePath)]
      };
    }

    this.resourceUri = vscode.Uri.file(nodePath);
  }
}

// 树数据提供者
export class ImageTreeDataProvider implements vscode.TreeDataProvider<ImageTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ImageTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private _imageCache: Map<string, ImageFile[]> = new Map();

  constructor(private readonly context: vscode.ExtensionContext) { }

  refresh(): void {
    this._imageCache.clear();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ImageTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ImageTreeItem): Promise<ImageTreeItem[]> {
    if (!vscode.workspace.workspaceFolders) {
      return [];
    }

    if (!element) {
      // 根节点：显示工作区文件夹
      const items: ImageTreeItem[] = [];
      for (const folder of vscode.workspace.workspaceFolders) {
        const images = await this.scanDirectoryForTree(folder.uri.fsPath);
        if (images.length > 0) {
          items.push(new ImageTreeItem(
            folder.name,
            vscode.TreeItemCollapsibleState.Expanded,
            folder.uri.fsPath,
            'folder',
            images.length
          ));
          this._imageCache.set(folder.uri.fsPath, images);
        }
      }
      return items;
    }

    // 子节点
    if (element.nodeType === 'folder') {
      return this.getChildrenForFolder(element.nodePath);
    }

    return [];
  }

  private async getChildrenForFolder(folderPath: string): Promise<ImageTreeItem[]> {
    const items: ImageTreeItem[] = [];
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    // 先处理文件夹
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        const subPath = path.join(folderPath, entry.name);
        const images = await this.scanDirectoryForTree(subPath);
        if (images.length > 0) {
          items.push(new ImageTreeItem(
            entry.name,
            vscode.TreeItemCollapsibleState.Collapsed,
            subPath,
            'folder',
            images.length
          ));
          this._imageCache.set(subPath, images);
        }
      }
    }

    // 再处理图片文件
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
          const filePath = path.join(folderPath, entry.name);
          items.push(new ImageTreeItem(
            entry.name,
            vscode.TreeItemCollapsibleState.None,
            filePath,
            'imageFile'
          ));
        }
      }
    }

    return items;
  }

  private async scanDirectoryForTree(dirPath: string): Promise<ImageFile[]> {
    const images: ImageFile[] = [];

    const scan = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            scan(fullPath);
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
              images.push({
                name: entry.name,
                path: fullPath,
                uri: fullPath,
                type: ext === '.svg' ? 'svg' : 'image',
                extension: ext.slice(1)
              });
            }
          }
        }
      } catch (e) {
        // 忽略权限错误
      }
    };

    scan(dirPath);
    return images;
  }

  // 获取指定文件夹下的所有图片
  getImagesForPath(folderPath: string): ImageFile[] {
    return this._imageCache.get(folderPath) || [];
  }
}
