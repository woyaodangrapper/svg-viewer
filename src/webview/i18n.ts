// Webview 国际化配置
export interface I18nMessages {
  // 搜索
  'search.placeholder.images': string;
  'search.placeholder.library': string;
  
  // 标签页
  'tab.all': string;
  'tab.vector': string;
  'tab.image': string;
  'tab.online': string;
  
  // 空状态
  'empty.noImages': string;
  'empty.noSvg': string;
  'empty.noImage': string;
  
  // 底部统计
  'footer.totalItems': string;
  
  // 卡片操作
  'action.edit': string;
  'action.locate': string;
}

const zhCN: I18nMessages = {
  'search.placeholder.images': '搜索图片...',
  'search.placeholder.library': '搜索图库...',
  'tab.all': '全部',
  'tab.vector': '矢量',
  'tab.image': '图片',
  'tab.online': '在线',
  'empty.noImages': '没有找到图片',
  'empty.noSvg': '没有找到 SVG',
  'empty.noImage': '没有找到图片',
  'footer.totalItems': '共 {count} 个项目',
  'action.edit': '编辑',
  'action.locate': '定位'
};

const enUS: I18nMessages = {
  'search.placeholder.images': 'Search images...',
  'search.placeholder.library': 'Search library...',
  'tab.all': 'All',
  'tab.vector': 'Vector',
  'tab.image': 'Image',
  'tab.online': 'Online',
  'empty.noImages': 'No images found',
  'empty.noSvg': 'No SVG found',
  'empty.noImage': 'No images found',
  'footer.totalItems': '{count} items in total',
  'action.edit': 'Edit',
  'action.locate': 'Locate'
};

const messages: Record<string, I18nMessages> = {
  'zh-cn': zhCN,
  'en': enUS
};

// 从 VS Code 传递的语言环境
let currentLocale = 'en';

export function setLocale(locale: string) {
  currentLocale = locale.toLowerCase();
}

export function t(key: keyof I18nMessages, params?: Record<string, string | number>): string {
  const locale = currentLocale === 'zh-cn' ? 'zh-cn' : 'en';
  let message = messages[locale]?.[key] || messages['en'][key];
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      message = message.replace(`{${k}}`, String(v));
    });
  }
  
  return message;
}
