import { blob } from 'hub:blob'

export default defineEventHandler(async (event) => {
    const path = getRouterParam(event, 'path')
    return blob.serve(event, `receipts/${path}`)
});