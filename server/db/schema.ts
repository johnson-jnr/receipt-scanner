import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// columns.helpers.ts
const timestamps = {
    updatedAt: integer({ mode: 'timestamp' }),
    createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer({ mode: 'timestamp' }),
}

//expenses table
export const expenses = sqliteTable('expenses', {
    id: integer().primaryKey({ autoIncrement: true }),
    merchant: text(),
    address: text(),
    total: real(),
    category: text(),
    date: text(),
    time: text(),
    receiptImagePath: text(),
    ...timestamps
})

//items table
export const items = sqliteTable('items', {
    id: integer().primaryKey({ autoIncrement: true }),
    expenseId: integer().notNull().references(() => expenses.id),
    name: text().notNull(),
    price: real(),
    quantity: integer(),
    ...timestamps
})

export const expensesRelations = relations(expenses, ({ many }) => ({
    items: many(items),
}))

export const itemsRelations = relations(items, ({ one }) => ({
    expense: one(expenses, {
        fields: [items.expenseId],
        references: [expenses.id],
    }),
}))