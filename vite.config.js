import legacy from '@vitejs/plugin-legacy'

const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
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
