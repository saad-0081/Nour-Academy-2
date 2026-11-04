  import { defineConfig } from 'vite'
  import tailwindcss from '@tailwindcss/vite'
  import { resolve } from 'path'
  import { fileURLToPath } from 'url'

  const root = fileURLToPath(new URL('.',
      import.meta.url))

  export default defineConfig({
      plugins: [tailwindcss()],
      build: {
          rollupOptions: {
              input: {
                  main: resolve(root, 'index.html'),
                  admin: resolve(root, 'admin.html'),
                  secretaire: resolve(root, 'secraitaire.html')
              },
          },
      },
  })