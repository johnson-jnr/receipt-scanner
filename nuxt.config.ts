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
        kv: true,
    },
    $production: {
        hub: {
            kv: {
                driver: 'cloudflare-kv-binding',
                namespaceId: process.env.HUB_KV_NAMESPACE_ID
            },
            blob: {
                driver: 'cloudflare-r2',
                bucketName: process.env.HUB_BLOB_BUCKET_NAME,
                binding: 'BLOB'
            },
            db: {
                dialect: 'sqlite',
                casing: 'snake_case',
                driver: 'd1',
                connection: { databaseId: process.env.HUB_DB_DATABASE_ID }
            },
        }
    },
    nitro: {
        experimental: {
            tasks: true
        },
        scheduledTasks: {
            '0 0 * * *': ['db:seed']
        },
        cloudflare: {
            wrangler: {
                triggers: {
                    crons: ['0 0 * * *']
                }
            }
        }
    },
    devtools: { enabled: true },
    css: ['./app/assets/css/globals.css', './app/assets/css/main.sass'],
    vite: {
        plugins: [tailwindcss(),]
    }
})
