import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    modules: ['@nuxt/ui', '@nuxthub/core', 'nuxt-auth-utils'],
    hub: {
        db: {
            dialect: 'sqlite',
            casing: 'snake_case'
        },
        blob: {
            driver: 'fs',
            dir: '.data/blob'
        },
        kv: true
    },
    nitro: {
        experimental: {
            tasks: true
        },
        scheduledTasks: {
            '0 0 * * *': ['db:seed']
        }
    },
    devtools: { enabled: true },
    css: ['./app/assets/css/globals.css', './app/assets/css/main.sass'],
    vite: {
        plugins: [tailwindcss(),]
    }
})
