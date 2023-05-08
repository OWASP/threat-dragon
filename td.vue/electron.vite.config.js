import { defineConfig } from 'electron-vite';
import path, { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: './',
  main: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/desktop.js')
        }
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/preload.js')
        }
      }
    }
  },
  renderer: {
    root: '.',
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
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        vue: '@vue/compat'
      }
    },
    build: {
      copyPublicDir: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        }
      }
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
    ]
  }
});
