import { defineConfig } from 'vite';
import path from 'path';

// 扩展构建配置
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/extension.ts'),
      formats: ['cjs'],
      fileName: () => 'extension.js'
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['vscode', 'fs', 'path'],
      output: {
        entryFileNames: 'extension.js'
      }
    },
    sourcemap: true,
    minify: false
  }
});
