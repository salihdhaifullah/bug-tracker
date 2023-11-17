import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            includeAssets: ['fonts/*.ttf', 'js/*.js', 'maskable_icon.png', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'favicon-16x16.png' ,'favicon-32x32.png', 'logo.svg'],
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
                type: 'module',
            },
            manifest: {
                name: 'Buegee',
                short_name: 'Buegee',
                description: 'Project Management Tool',
                theme_color: '#bae6fd',
                start_url: '/',
                display: 'standalone',
                background_color: '#bae6fd',
                icons: [
                    {
                        src: 'android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'maskable_icon.png',
                        sizes: '1024x1024',
                        type: 'image/png',
                        purpose: 'maskable',
                    },

                ],
            },
        }),
    ],
})

