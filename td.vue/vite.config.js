import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const path = require('path');
const serverApiProtocol = process.env.SERVER_API_PROTOCOL || 'http';
const serverApiPort = process.env.PORT || '3000';
console.log('Server API protocol: ' + serverApiProtocol + ' and port: ' + serverApiPort);

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/scss/bootstrap.scss";'
      }
    }
  },
  define: {
    '__APP_VERSION__': JSON.stringify(require('./package.json').version),
    '__APP_BUILD_STATE__': JSON.stringify(require('./package.json').buildState)
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      vue: '@vue/compat'
    }
  },
  server: {
    proxy: {
      '^/api': {
        target: serverApiProtocol + '://localhost:' + serverApiPort,
        ws: true,
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      reporter: [
        'text',
        'html'
      ],
      exclude: [
        '**/node_modules/**'
      ]
    },
    include: [
      // 'tests/unit/**/*.spec.js'
      'tests/unit/*.spec.js'
    ]
  }
});
