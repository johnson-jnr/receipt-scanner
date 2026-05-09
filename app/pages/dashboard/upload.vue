<template>
    <UDashboardPanel id="upload">
        <template #header>
            <UDashboardNavbar title="Upload">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="min-w-4xl mx-auto">
                <!-- Per-file cards -->
                <div v-if="localFiles.length" class="mt-4 space-y-4">
                    <div
                        v-for="(file, index) in localFiles"
                        :key="index"
                        class="border border-default rounded-xl overflow-hidden"
                    >
                        <!-- Card header: preview + file info + remove -->
                        <div
                            class="flex items-center gap-3 px-4 py-3 bg-elevated/30 border-b border-default cursor-pointer select-none"
                            :class="{ 'border-b-0': collapsedCards.has(index) }"
                            @click="toggleCard(index)"
                        >
                            <UButton
                                color="neutral"
                                variant="ghost"
                                icon="i-lucide-chevron-down"
                                square
                                :ui="{
                                    leadingIcon: [
                                        'transition-transform duration-200',
                                        !collapsedCards.has(index) ? 'rotate-180' : '',
                                    ],
                                }"
                                :aria-label="collapsedCards.has(index) ? 'Expand' : 'Collapse'"
                                @click.stop="toggleCard(index)"
                            />

                            <UModal>
                                <img
                                    :src="createObjectUrl(file)"
                                    class="w-10 h-10 object-cover rounded cursor-pointer"
                                    alt=""
                                    @click.stop
                                />
                                <template #content>
                                    <div class="h-80 m-4">
                                        <img
                                            :src="createObjectUrl(file)"
                                            class="object-contain w-full h-full"
                                            alt=""
                                        />
                                    </div>
                                </template>
                            </UModal>

                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium truncate">{{ file.name }}</p>
                                <p class="text-xs text-muted">{{ formatFileSize(file.size) }}</p>
                            </div>

                            <UButton
                                color="neutral"
                                variant="ghost"
                                icon="i-lucide-x"
                                square
                                :aria-label="`Remove ${file.name}`"
                                @click.stop="removeFileAt(index)"
                            />
                        </div>

                        <!-- Scanned expense fields -->
                        <div
                            v-if="expenses[index] && !collapsedCards.has(index)"
                            class="p-4 space-y-4"
                        >
                            <div class="grid grid-cols-3 gap-3">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-muted font-medium">Merchant</span>
                                    <UInput v-model="expenses[index].merchant" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-muted font-medium">Category</span>
                                    <UInput v-model="expenses[index].category" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-muted font-medium">Address</span>
                                    <UInput v-model="expenses[index].address" class="w-full" />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-muted font-medium">Date</span>
                                    <UInput
                                        v-model="expenses[index].date"
                                        type="date"
                                        class="w-full"
                                    />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-muted font-medium">Time</span>
                                    <UInput
                                        :model-value="expenses[index].time?.slice(0, 5)"
                                        type="time"
                                        class="w-full"
                                        @update:model-value="
                                            (v: string) => (expenses[index]!.time = v)
                                        "
                                    />
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs text-muted font-medium">Total</span>
                                    <UInput
                                        v-model.number="expenses[index].total"
                                        type="number"
                                        class="w-full"
                                    />
                                </div>
                            </div>

                            <!-- Line items -->
                            <div v-if="expenses[index].items?.length">
                                <p class="text-xs text-muted font-medium mb-1">
                                    Items ({{ expenses[index].items.length }})
                                </p>
                                <UTable
                                    :data="expenses[index].items"
                                    :columns="itemColumns"
                                    :ui="{ td: 'p-1!' }"
                                />
                            </div>
                        </div>

                        <!-- Not yet scanned / scanning state -->
                        <div
                            v-else-if="!collapsedCards.has(index)"
                            class="px-4 py-6 text-center text-sm text-muted"
                        >
                            <span v-if="isScanning">Scanning…</span>
                            <span v-else>Not yet scanned</span>
                        </div>
                    </div>
                </div>

                <UFileUpload
                    :ui="{
                        base: 'mt-6 bg-elevated/30 hover:bg-elevated/60 data-[dragging=true]:bg-elevated/60',
                    }"
                    icon="i-lucide-image"
                    highlight
                    v-model="localFiles"
                    multiple
                    :preview="false"
                    accept="image/*"
                    label="Drop your Receipts here"
                    class="w-full min-h-44"
                    layout="list"
                >
                    <!-- <template #files></template> -->
                </UFileUpload>

                <!-- Actions -->
                <div class="flex gap-2 mt-6">
                    <UButton
                        v-if="localFiles.length && !expenses.length"
                        :loading="isScanning"
                        @click="scanReceipt"
                    >
                        Scan Receipt
                    </UButton>
                    <template v-if="expenses.length">
                        <UButton :loading="isSavingExpense" @click="saveExpense">
                            Save Expense
                        </UButton>
                        <UButton
                            v-if="localFiles.length"
                            :loading="isScanning"
                            @click="scanReceipt"
                        >
                            Rescan
                        </UButton>
                    </template>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

const localFiles = ref<File[]>([]);
const isScanning = ref(false);
const isSavingExpense = ref(false);
const collapsedCards = reactive(new Set<number>());

function toggleCard(index: number) {
    if (collapsedCards.has(index)) {
        collapsedCards.delete(index);
    } else {
        collapsedCards.add(index);
    }
}

const UInput = resolveComponent('UInput');

import type { Expense, Item } from '~~/shared/types/db';

type ExpenseWithItems = Expense & { items: Item[] };

const expenses = ref<ExpenseWithItems[]>([]);
const toast = useToast();

const itemColumns = [
    {
        accessorKey: 'name',
        header: 'Item',
        cell: ({ row }: { row: { original: { name: string } } }) =>
            h(UInput, {
                class: 'w-full',
                modelValue: row.original.name,
                'onUpdate:modelValue': (value: string) => {
                    row.original.name = value;
                },
            }),
    },
    {
        accessorKey: 'quantity',
        header: 'Qty',
        cell: ({ row }: { row: { original: { quantity: number | null } } }) =>
            h(UInput, {
                class: 'w-full',
                modelValue: row.original.quantity,
                type: 'number',
                'onUpdate:modelValue': (value: string | number) => {
                    row.original.quantity = Number(value);
                },
            }),
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }: { row: { original: { price: number | null } } }) =>
            h(UInput, {
                class: 'w-full',
                modelValue: row.original.price,
                type: 'number',
                'onUpdate:modelValue': (value: string | number) => {
                    row.original.price = Number(value);
                },
            }),
    },
];

function removeFileAt(index: number) {
    localFiles.value.splice(index, 1);
    if (expenses.value.length > index) {
        expenses.value.splice(index, 1);
    }
}

const scanReceipt = async () => {
    isScanning.value = true;
    const form = new FormData();
    localFiles.value.forEach((file) => form.append('files', file));

    try {
        const result = await $fetch('/api/receipts/scan', {
            method: 'POST',
            body: form,
        });
        expenses.value = result as ExpenseWithItems[];
    } catch (e) {
        console.error(e);
        toast.add({
            title: 'Server Error',
            description: 'Error scanning the receipts. Please try again later.',
            color: 'error',
        });
    } finally {
        isScanning.value = false;
    }
};

const saveExpense = async () => {
    isSavingExpense.value = true;
    const form = new FormData();
    localFiles.value.forEach((file) => form.append('files', file));

    try {
        const blobs = await $fetch('/api/receipts/upload', { method: 'POST', body: form });

        const expensesWithImages = expenses.value.map((expense, i) => ({
            ...expense,
            receiptImagePath: blobs[i]?.pathname ?? null,
        }));

        await $fetch('/api/expenses', { method: 'POST', body: expensesWithImages });
        toast.add({
            title: 'Success',
            description: 'Expense saved successfully',
            color: 'success',
        });
        await navigateTo('/dashboard');
    } catch (e) {
        console.log(e);
    } finally {
        isSavingExpense.value = false;
    }
};
</script>
