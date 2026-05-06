import { expenses, items, users } from '@nuxthub/db/schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Expense = typeof expenses.$inferSelect
export type Item = typeof items.$inferSelect

export type NewExpense = typeof expenses.$inferInsert
export type NewItem = typeof items.$inferInsert
