export default defineEventHandler(async (event) => {
    if (process.env.MOCK_SCAN === 'true') {
        console.log('towo serve');
        await new Promise(resolve => setTimeout(resolve, 3000));
        return [
            {
                merchant: "Aroma Cafe",
                address: "1211 Green Street, New York, NY 10005",
                items: [
                    { name: "Americano", price: 3.19, quantity: 1 },
                    { name: "Almond Scone", price: 1.99, quantity: 1 },
                    { name: "16oz Bottle Water", price: 2.99, quantity: 1 },
                ],
                total: 8.7,
                category: "Dining",
                date: "2019-12-27",
                time: "20:26:00Z",
            },
            {
                merchant: "Aroma Cafe",
                address: "1211 Green Street, New York, NY 10005",
                items: [
                    { name: "Americano", price: 3.19, quantity: 1 },
                    { name: "Almond Scone", price: 1.99, quantity: 1 },
                    { name: "16oz Bottle Water", price: 2.99, quantity: 1 },
                ],
                total: 8.7,
                category: "Dining",
                date: "2019-12-27",
                time: "20:26:00Z",
            },
        ];
    }

    const form = await readFormData(event);
    const response = await $fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        body: form,
    });
    return response;
});
