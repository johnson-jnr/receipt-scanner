import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody<{ email: string; password: string }>(event)

    const existing = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
    })

    if (existing) {
        throw createError({ statusCode: 409, message: 'Email already in use' })
    }

    const hashed = await hashPassword(password)

    const [user] = await db
        .insert(schema.users)
        .values({ email, password: hashed })
        .returning({ id: schema.users.id, email: schema.users.email })

    return user
})
