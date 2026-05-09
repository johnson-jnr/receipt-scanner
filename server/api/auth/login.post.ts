import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody<{ email: string; password: string }>(event)

    const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
    })

    if (!user || !(await verifyPassword(user.password, password))) {
        throw createError({ statusCode: 401, message: 'Invalid email or password' })
    }

    await setUserSession(event, {
        user: { id: user.id, email: user.email, name: user.name, currency: user.currency },
    })

    return { user: user, success: true }
})