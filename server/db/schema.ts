import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// columns.helpers.ts
const timestamps = {
    updatedAt: integer({ mode: 'timestamp' }).$onUpdateFn(() => new Date()),
    createdAt: integer({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}

//users table
export const users = sqliteTable('users', {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    ...timestamps
})

//expenses table
export const expenses = sqliteTable('expenses', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: integer().notNull().references(() => users.id),
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

export const usersRelations = relations(users, ({ many }) => ({
    expenses: many(expenses),
}))

export const expensesRelations = relations(expenses, ({ one, many }) => ({
    user: one(users, {
        fields: [expenses.userId],
        references: [users.id],
    }),
    items: many(items),
}))

export const itemsRelations = relations(items, ({ one }) => ({
    expense: one(expenses, {
        fields: [items.expenseId],
        references: [expenses.id],
    }),
}))