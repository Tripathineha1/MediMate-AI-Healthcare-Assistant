import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: "src/assets",
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        rewrite: (path) => path.replace(/^\/api/, ''),
        changeOrigin:true,
        secure: false,
      }
    }
  }
})
