import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@lemoe-admin': path.resolve(__dirname, 'lib'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.js'),
      name: 'LemoeAdmin',
      fileName: (format) => `lemoe-admin.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'lodash', 'element-plus', 'sortablejs', 'draggable'],
      output: {
        globals: {
          vue: 'Vue',
          lodash: 'lodash',
          'element-plus': 'elementPlus',
          sortablejs: 'sortablejs',
          draggable: 'draggable',
        },
      },
    },
  },
  plugins: [vue()],
});
