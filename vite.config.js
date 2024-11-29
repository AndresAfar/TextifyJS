import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/RichTextEditor.js'),
      name: 'textifyjs',
      // the proper extensions will be added
      fileName: 'textifyjs',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vanilla'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vanilla: 'Vanilla',
        },
      },
    },
  },
})