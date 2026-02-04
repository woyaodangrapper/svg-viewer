// 支持的图片格式
export const IMAGE_EXTENSIONS = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.bmp'];

// 图片文件接口
export interface ImageFile {
  name: string;
  path: string;
  uri: string;
  type: 'svg' | 'image';
  extension: string;
}

// 树节点类型
export type TreeNodeType = 'folder' | 'imageFile';
