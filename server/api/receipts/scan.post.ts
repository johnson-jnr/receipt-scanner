import { openai } from '@ai-sdk/openai';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { kv } from '@nuxthub/kv';
import type { H3Event } from 'h3';

async function checkScanRateLimit(event: H3Event) {
    const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
    const key = `ratelimit:scan:${ip}`
    const count = await kv.get<number>(key) ?? 0;

    if (count >= 3) {
        throw createError({ statusCode: 429, message: 'Scan limit reached (3 per day)' })
    }

    await kv.set(key, count + 1, { ttl: 86400 }) // TTL equals to 24 hours
}

const receiptSchema = z.object({
    merchant: z.string().nullable(),
    address: z.string().nullable(),
    items: z.array(
        z.object({
            name: z.string(),
            price: z.number().nullable(),
            quantity: z.number().nullable(),
        }),
    ),
    total: z.number().nullable(),
    category: z.string().nullable(),
    date: z.string().nullable(),
    time: z.string().nullable(),
});

export default defineEventHandler(async (event) => {
    await checkScanRateLimit(event);

    if (process.env.MOCK_SCAN === 'true') {
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
            }
        ];
    }

    const form = await readFormData(event);

    // const response = await $fetch("http://127.0.0.1:8000/scan", {
    //     method: "POST",
    //     body: form,
    // });
    // return response;

    const files = form.getAll('files') as File[];

    const results = await Promise.all(
        files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());

            const { output } = await generateText({
                model: openai('gpt-4o'),
                output: Output.object({ schema: receiptSchema }),
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'image', image: buffer, mediaType: file.type || 'image/jpeg' },
                            {
                                type: 'text',
                                text: [
                                    "Extract the receipt details from this image.",
                                    "For category, make a best guess (e.g. Groceries, Dining, Transport, Healthcare, Shopping). If unsure, return 'Uncategorized'.",
                                    "For date, extract the date of transaction on the receipt.",
                                    "Date format on the receipt may be MM/DD/YYYY, DD/MM/YYYY or similar — convert to ISO format (YYYY-MM-DD).",
                                    "For time, extract the time of transaction on the receipt and return it in HH:MM format (24-hour, no seconds, no timezone offset).",
                                    "For address, combine all address parts (street, city, state, country, postal code) into a single string.",
                                    "If a value is not visible, return null."
                                ].join(' '),
                            },
                        ],
                    },
                ],
            });

            return output;
        }),
    );

    return results;
});
