import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/slate-vue-alpha/',
  plugins: [vue(), jsx()]
})
