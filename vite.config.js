import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  server: {
    host: 'localhost',
    port: 3000,
    open: false,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
    extensions: ['.js'],
  },
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // page 구현 시 연결할 html 파일
        // detail: resolve(__dirname, 'src/pages/detail/index.html'),
      },
    },
  },
});
