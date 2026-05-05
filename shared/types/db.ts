import { expenses, items } from '@nuxthub/db/schema'

export type Expense = typeof expenses.$inferSelect
export type Item = typeof items.$inferSelect

export type NewExpense = typeof expenses.$inferInsert
export type NewItem = typeof items.$inferInsert
