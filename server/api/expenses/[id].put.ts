import { db, schema } from '@nuxthub/db'
import { and, eq } from 'drizzle-orm'
import type { NewExpense, NewItem } from '~~/shared/types/db'

type PatchBody = Partial<NewExpense> & { items?: Partial<NewItem>[] }

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const id = Number(getRouterParam(event, 'id'))

    if (!id) {
        throw createError({ statusCode: 400, message: 'Invalid expense ID' })
    }

    const { items, ...expenseData } = await readBody<PatchBody>(event)

    const [updated] = await db
        .update(schema.expenses)
        .set(expenseData)
        .where(and(eq(schema.expenses.id, id), eq(schema.expenses.userId, user.id)))
        .returning()

    if (!updated) {
        throw createError({ statusCode: 404, message: 'Expense not found' })
    }

    if (items?.length) {
        await db.delete(schema.items).where(eq(schema.items.expenseId, id))
        await db.insert(schema.items).values(
            items.map((item) => ({
                name: item.name ?? '',
                price: item.price ?? null,
                quantity: item.quantity ?? null,
                expenseId: id,
            })),
        )
    }

    return db.query.expenses.findFirst({
        where: (expenses, { eq }) => eq(expenses.id, id),
        with: { items: true },
    })
})
