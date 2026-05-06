import { db } from '@nuxthub/db'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const expense = await db.query.expenses.findFirst({
        where: (expenses, { eq }) => eq(expenses.id, Number(id)),
        with: { items: true },
    })

    if (!expense) {
        throw createError({ statusCode: 404, message: 'Expense not found' })
    }

    return expense
})
