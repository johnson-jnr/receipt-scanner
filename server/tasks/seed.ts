import { db, schema } from '@nuxthub/db'
import { eq } from 'drizzle-orm'

async function clearDemoUser() {
    const user = await db.query.users.findFirst({
        where: eq(schema.users.email, 'demo@receipt-scanner.app'),
    })

    if (!user) return;

    const userExpenses = await db.query.expenses.findMany({
        where: eq(schema.expenses.userId, user.id),
    })
    for (const expense of userExpenses) {
        await db.delete(schema.items).where(eq(schema.items.expenseId, expense.id))
    }
    await db.delete(schema.expenses).where(eq(schema.expenses.userId, user.id))
    await db.delete(schema.users).where(eq(schema.users.id, user.id))
}

export default defineTask({
    meta: {
        name: 'db:seed',
        description: 'Seed database with initial data'
    },
    async run() {
        console.log('Seeding database...')

        await clearDemoUser();

        const [user] = await db.insert(schema.users).values({
            name: 'Jane Doe',
            email: 'demo@receipt-scanner.app',
            password: await hashPassword('demo-password'),
            currency: 'USD',
        }).returning()

        if (!user) throw new Error('Failed to insert demo user')

        const expenseSeeds = [
            {
                expense: {
                    userId: user.id,
                    merchant: 'Aroma Cafe',
                    address: '1211 Green Street, New York, NY 10005',
                    total: 8.70,
                    category: 'Dining',
                    date: '2026-04-03',
                    time: '08:26',
                },
                items: [
                    { name: 'Americano', price: 3.19, quantity: 1 },
                    { name: 'Almond Scone', price: 1.99, quantity: 1 },
                    { name: '16oz Bottle Water', price: 2.99, quantity: 1 },
                ],
            },
            {
                expense: {
                    userId: user.id,
                    merchant: 'Whole Foods Market',
                    address: '808 Columbus Ave, New York, NY 10025',
                    total: 67.43,
                    category: 'Groceries',
                    date: '2026-04-07',
                    time: '17:14',
                },
                items: [
                    { name: 'Organic Whole Milk', price: 5.99, quantity: 1 },
                    { name: 'Sourdough Bread', price: 6.49, quantity: 1 },
                    { name: 'Free Range Eggs (12)', price: 7.99, quantity: 1 },
                    { name: 'Baby Spinach', price: 4.49, quantity: 2 },
                    { name: 'Chicken Breast', price: 14.99, quantity: 1 },
                    { name: 'Pasta', price: 2.99, quantity: 3 },
                    { name: 'Tomato Sauce', price: 3.49, quantity: 2 },
                ],
            },
            {
                expense: {
                    userId: user.id,
                    merchant: 'Shell',
                    address: '450 W 33rd St, New York, NY 10001',
                    total: 54.20,
                    category: 'Transport',
                    date: '2026-04-10',
                    time: '09:05',
                },
                items: [
                    { name: 'Unleaded Fuel (12.4 gal)', price: 49.60, quantity: 1 },
                    { name: 'Car Wash', price: 4.60, quantity: 1 },
                ],
            },
            {
                expense: {
                    userId: user.id,
                    merchant: 'H&M',
                    address: '505 5th Ave, New York, NY 10017',
                    total: 89.97,
                    category: 'Shopping',
                    date: '2026-04-15',
                    time: '14:33',
                },
                items: [
                    { name: 'Slim Fit Chinos', price: 39.99, quantity: 1 },
                    { name: 'Crew Neck T-Shirt', price: 14.99, quantity: 2 },
                    { name: 'Cotton Socks (3-pack)', price: 9.99, quantity: 2 },
                ],
            },
            {
                expense: {
                    userId: user.id,
                    merchant: 'CVS Pharmacy',
                    address: '200 W 57th St, New York, NY 10019',
                    total: 31.86,
                    category: 'Healthcare',
                    date: '2026-04-21',
                    time: '11:47',
                },
                items: [
                    { name: 'Ibuprofen 200mg (50ct)', price: 8.49, quantity: 1 },
                    { name: 'Vitamin D3 1000 IU', price: 12.99, quantity: 1 },
                    { name: 'Hand Sanitizer', price: 4.19, quantity: 2 },
                ],
            },
            {
                expense: {
                    userId: user.id,
                    merchant: "Shake Shack",
                    address: '691 8th Ave, New York, NY 10036',
                    total: 28.45,
                    category: 'Dining',
                    date: '2026-04-28',
                    time: '13:10',
                },
                items: [
                    { name: 'ShackBurger', price: 9.29, quantity: 2 },
                    { name: 'Crinkle Cut Fries', price: 4.09, quantity: 2 },
                    { name: 'Chocolate Shake', price: 6.89, quantity: 1 },
                ],
            },
        ]

        for (const { expense, items } of expenseSeeds) {
            const [inserted] = await db.insert(schema.expenses).values(expense).returning()
            if (!inserted) throw new Error(`Failed to insert expense for ${expense.merchant}`)
            await db.insert(schema.items).values(
                items.map(item => ({ ...item, expenseId: inserted.id }))
            )
        }

        return { result: 'Database seeded successfully' }
    }
})
