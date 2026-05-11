export default defineEventHandler(async (event) => {
    const secret = getHeader(event, 'x-internal-secret')
    if (secret !== process.env.APP_SECRET) {
        throw createError({ statusCode: 401 })
    }
    return await runTask('db:seed')
})
