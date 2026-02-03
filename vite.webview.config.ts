import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Webview 构建配置
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist/webview',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/webview/index.tsx'),
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'index.[ext]'
      }
    },
    sourcemap: true,
    minify: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
});
