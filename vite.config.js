import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  publicDir: 'public',
  server: {
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // 不要重写路径
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
