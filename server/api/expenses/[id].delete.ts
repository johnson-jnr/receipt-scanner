import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    const [deleted] = await db
        .delete(schema.expenses)
        .where(eq(schema.expenses.id, id))
        .returning()

    if (!deleted) {
        throw createError({ statusCode: 404, message: 'Expense not found' })
    }

    return { success: true }
})
