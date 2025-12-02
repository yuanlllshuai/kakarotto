import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import cesium from 'vite-plugin-cesium'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  server: {
    host: '0.0.0.0'
  },
  css: {
    preprocessorOptions: {
      scss: {}
    },
    modules: {
      scopeBehaviour: 'local'
    }
  },
  resolve: {
    alias: {
      '@/': '/src/'
    }
  }
})
