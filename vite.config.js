// vite.config.js
/** @type {import('vite').UserConfig} */
import legacy from '@vitejs/plugin-legacy'

export default {
    // config options
    root: './src',

    server: {
        port: 3000,
        host: true,
    },

    plugins: [
        legacy({
            targets: ['defaults', 'not IE 11']
        })
    ],

    build: {
        emptyOutDir: true,
        outDir: '../dist',
        sourcemap: true,
    }
}
