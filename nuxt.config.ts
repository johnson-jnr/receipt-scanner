import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    modules: ['@nuxt/ui', '@nuxthub/core'],
    hub: {
        db: {
            dialect: 'sqlite',
            casing: 'snake_case'
        },
        blob: {
            driver: 'fs',
            dir: '.data/blob'
        }
    },
    devtools: { enabled: true },
    css: ['./app/assets/css/globals.css', './app/assets/css/main.sass'],
    vite: {
        plugins: [tailwindcss(),]
    }
})
