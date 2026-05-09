import { db, schema } from '@nuxthub/db'
import type { NewExpense, NewItem } from '~~/shared/types/db'

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)

    const expenses = await readBody<(NewExpense & { items: NewItem[] })[]>(event)

    try {
        for (const expense of expenses) {
            const { items, ...expenseData } = expense;

            const [inserted] = await db
                .insert(schema.expenses)
                .values({ ...expenseData, userId: user.id })
                .returning()

            if (items?.length && inserted) {
                await db.insert(schema.items).values(
                    items.map((item) => ({ ...item, expenseId: inserted.id }))
                )
            }
        }
    } catch (err) {
        console.error('Save expenses error:', err)
        throw createError({
            statusCode: 500,
            message: 'Failed to save expenses',
        })
    }

    return { success: true }
});
