import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'
import type { NewExpense } from '~~/shared/types/db'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readBody<Partial<NewExpense>>(event)

    const [updated] = await db
        .update(schema.expenses)
        .set(body)
        .where(eq(schema.expenses.id, id))
        .returning()

    if (!updated) {
        throw createError({ statusCode: 404, message: 'Expense not found' })
    }

    return updated
})
