import path from 'node:path'
import {fileURLToPath} from 'node:url'
import legacy from '@vitejs/plugin-legacy'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  root: path.resolve(__dirname, 'src'),
  envDir: path.resolve(__dirname),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Remaining deprecations originate inside Bootstrap 5.3's own SCSS
        // (node_modules); silence those so our own warnings stay visible.
        quietDeps: true
      }
    }
  },
  server: {
    port: 8080,
    hot: true
  },
  plugins: [
    legacy({
      targets: ['defaults'],
    }),
  ],
  build: {
    outDir: '../public',
    emptyOutDir: true,
    sourcemap: true
  }
}
