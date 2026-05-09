import { db } from '@nuxthub/db'
import { desc, eq } from 'drizzle-orm'
import { expenses } from '../../db/schema'

export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)

    return await db.query.expenses.findMany({
        where: eq(expenses.userId, user.id),
        with: { items: true },
        orderBy: desc(expenses.createdAt),
    })
})
