import { db } from '@nuxthub/db'
import { desc } from 'drizzle-orm'
import { expenses } from '../../db/schema'

export default defineEventHandler(async () => {
    return await db.query.expenses.findMany({
        with: { items: true },
        orderBy: desc(expenses.createdAt),
    })
})
