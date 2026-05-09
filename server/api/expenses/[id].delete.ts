import { db, schema } from '@nuxthub/db'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
        throw createError({ statusCode: 400, message: 'Invalid expense ID' })
    }

    const [deleted] = await db
        .delete(schema.expenses)
        .where(and(eq(schema.expenses.id, id), eq(schema.expenses.userId, user.id)))
        .returning()

    if (!deleted) {
        throw createError({ statusCode: 404, message: 'Expense not found' })
    }

    return { success: true }
})
