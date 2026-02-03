import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '@heroui/react';
import App from './App';
import './styles.css';

declare global {
  interface Window {
    __IMAGES__: Array<{
      name: string;
      path: string;
      uri: string;
      type: 'svg' | 'image';
      extension: string;
    }>;
  }
}

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <I18nProvider locale="zh-CN">
      <App images={window.__IMAGES__ || []} />
    </I18nProvider>
  </React.StrictMode>
);
