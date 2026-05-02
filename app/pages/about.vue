<script setup lang="ts">
import { h, resolveComponent, ref } from 'vue';
// import type { ColumnDef } from '@tanstack/vue-table'

const UInput = resolveComponent('UInput');

const data = ref([
    { id: 1, name: 'John Doe', email: 'john@example.com', amount: 100 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: 200 },
]);

const columns = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }: { row: { original: { name: string } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.name,
                'onUpdate:modelValue': (value: string) => {
                    row.original.name = value;
                },
            });
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }: { row: { original: { email: string } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.email,
                type: 'email',
                'onUpdate:modelValue': (value: string) => {
                    row.original.email = value;
                },
            });
        },
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }: { row: { original: { amount: number } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.amount,
                type: 'number',
                'onUpdate:modelValue': (value: string | number) => {
                    const next = typeof value === 'number' ? value : Number(value);
                    row.original.amount = Number.isFinite(next) ? next : 0;
                },
            });
        },
    },
];
</script>

<template>
    <UTable :data="data" :columns="columns" :ui="{ td: 'p-1!' }" />
</template>
