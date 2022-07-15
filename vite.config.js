// vite.config.js
/** @type {import('vite').UserConfig} */

export default {
    // config options
    root: './src',

    server: {
        port: 3000,
    },

    build: {
        emptyOutDir: true,
        outDir: '../dist',
    }
}
