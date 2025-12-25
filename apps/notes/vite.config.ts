import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../../dist/apps/notes',
    reportCompressedSize: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@knowtis/design-system/styles.css': resolve(
        __dirname,
        '../../libs/design-system/src/styles.css'
      ),
      '@knowtis/design-system': resolve(
        __dirname,
        '../../libs/design-system/src/index.ts'
      ),
      '@knowtis/shared-hooks': resolve(
        __dirname,
        '../../libs/shared/hooks/src/index.ts'
      ),
      '@knowtis/shared-util': resolve(
        __dirname,
        '../../libs/shared/util/src/index.ts'
      ),
      '@knowtis/data-access-notes': resolve(
        __dirname,
        '../../libs/data-access/notes/src/index.ts'
      ),
    },
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
});
