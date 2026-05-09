import { db } from '@nuxthub/db'

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
        throw createError({ statusCode: 400, message: 'Invalid expense ID' })
    }

    const expense = await db.query.expenses.findFirst({
        where: (expenses, { eq, and }) => and(eq(expenses.id, id), eq(expenses.userId, user.id)),
        with: { items: true },
    })

    if (!expense) {
        throw createError({ statusCode: 404, message: 'Expense not found' })
    }

    return expense
})
