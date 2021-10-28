import { defineConfig, UserConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

export const common: UserConfig = {
  base: '/slate-vue-alpha/',
  plugins: [vue(), jsx()],
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    __DEV__: process.env.NODE_ENV !== 'production'
  },
  build: {
    outDir: 'dist',
    minify: process.env.NODE_ENV === 'production'
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
}

// https://vitejs.dev/config/
export default defineConfig(common)
