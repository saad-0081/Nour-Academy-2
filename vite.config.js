import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                secraitaire: resolve(__dirname, 'secretaire.html'),
                admin: resolve(__dirname, 'admin.html'),

            },
        },
    },
})