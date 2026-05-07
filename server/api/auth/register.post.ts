import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const { email, password, name } = await readBody<{ email: string; password: string, name: string }>(event)

    const existing = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
    })

    if (existing) {
        throw createError({ statusCode: 409, message: 'Email already in use' })
    }

    const hashed = await hashPassword(password)

    const [user] = await db
        .insert(schema.users)
        .values({ name, email, password: hashed })
        .returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name })

    if (!user) {
        throw createError({ statusCode: 500, message: 'Failed to create user' })
    }

    await setUserSession(event, {
        user: { id: user.id, email: user.email, name: user.name },
    })

    return user
})
