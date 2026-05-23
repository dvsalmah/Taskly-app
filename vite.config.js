import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    server: {
        host: 'localhost',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
    },
    plugins: [
        tailwindcss(),   // ← pindah ke PERTAMA
        laravel({
            input: [
                'resources/css/app.css',  // ← TAMBAHKAN INI
                'resources/js/app.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});