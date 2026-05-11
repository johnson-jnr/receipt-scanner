import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const user = await db.query.users.findFirst({
        where: eq(schema.users.email, 'demo@receipt-scanner.app'),
    })

    if (!user) {
        throw createError({ statusCode: 503, message: 'Demo unavailable' })
    }

    await setUserSession(event, {
        user: { id: user.id, email: user.email, name: user.name, currency: user.currency },
    })

    return { success: true }
})
