import { db } from '@nuxthub/db'

export default defineEventHandler(async () => {
    return await db.query.expenses.findMany({
        with: { items: true },
    })
})
