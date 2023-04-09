import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

let base = '/' + (process.env.BASE_URL || '');

if (!base.endsWith('/')) {
  base += '/';
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
