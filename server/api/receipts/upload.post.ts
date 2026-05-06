import { blob } from 'hub:blob'

export default defineEventHandler(async (event) => {
    return blob.handleUpload(event, {
        formKey: 'files',
        multiple: true,
        ensure: {
            maxSize: '64MB',
            types: ['image/jpeg', 'image/png', 'image/webp'],
        },
        put: {
            prefix: 'receipts',
            addRandomSuffix: true,
        },
    })
})
