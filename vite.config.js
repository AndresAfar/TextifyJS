import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/RichTextEditor.js'),
      translations: resolve(__dirname, 'src/translations.js'),
      name: 'TextifyJS',
      // the proper extensions will be added
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'textifyjslib.js'
          case 'umd':
            return 'textifyjslib.umd.js'
          case 'iife':
            return 'textifyjs.min.js' // This will be the CDN version
        }
      }
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vanilla'],
      output: {
        // Global variable name when used in browser
        globals: {
          TextifyJS: 'TextifyJS'
        },
        // Generate sourcemaps
        sourcemap: true,
        // Ensure the CSS is extracted
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'textifyjs.min.css'
          }
          return assetInfo.name
        }
      },
      // Minimize the output
      minify: 'terser',
      // Generate sourcemaps
      sourcemap: true
    },
  },
})