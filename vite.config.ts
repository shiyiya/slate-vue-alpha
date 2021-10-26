import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
// import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/slate-vue-alpha/',
  plugins: [vue(), jsx()],
  define: {
    'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
    __DEV__: process.env.NODE_ENV !== 'production'
  },
  build: {
    minify: process.env.NODE_ENV === 'production'
    // lib: {
    //   entry: path.resolve(__dirname, 'src/index.ts'),
    //   name: 'slate-vue'
    // }
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
