<template>
    <UDashboardPanel id="dashboard">
        <template #header>
            <UDashboardNavbar title="Dashboard">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <!-- Expenses Stats -->
            <div class="p-4">
                <UPageGrid class="lg:grid-cols-3 gap-4">
                    <UPageCard
                        icon="i-lucide-circle-dollar-sign"
                        title="Total Spent"
                        variant="subtle"
                        class="hover:bg-elevated transition-colors"
                        :ui="{
                            container: 'gap-y-1.5',
                            wrapper: 'items-start',
                            leading:
                                'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <span class="text-2xl font-semibold text-highlighted">
                            ${{ totalSpent.toFixed(2) }}
                        </span>
                    </UPageCard>

                    <UPageCard
                        icon="i-lucide-receipt-text"
                        title="Receipts Scanned"
                        variant="subtle"
                        class="hover:bg-elevated transition-colors"
                        :ui="{
                            container: 'gap-y-1.5',
                            wrapper: 'items-start',
                            leading:
                                'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <span class="text-2xl font-semibold text-highlighted">
                            {{ expenses?.length ?? 0 }}
                        </span>
                    </UPageCard>

                    <UPageCard
                        icon="i-lucide-tag"
                        title="Top Category"
                        variant="subtle"
                        class="hover:bg-elevated transition-colors"
                        :ui="{
                            container: 'gap-y-1.5',
                            wrapper: 'items-start',
                            leading:
                                'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <span class="text-2xl font-semibold text-highlighted">
                            {{ topCategory ?? '—' }}
                        </span>
                    </UPageCard>
                </UPageGrid>
            </div>

            <!-- Category Breakdown -->
            <div class="px-4 pb-4">
                <UCard :ui="{ root: 'overflow-auto', body: 'px-0! py-0!' }">
                    <template #header>
                        <p class="text-base font-semibold text-highlighted">Spending by Category</p>
                    </template>

                    <div class="flex items-center justify-center gap-8 px-4 py-4">
                        <div class="size-56">
                            <VisSingleContainer :data="categoryData" class="size-56">
                                <VisDonut
                                    :value="(d: CategoryData) => d.total"
                                    :central-label="topCategoryPercent"
                                    :central-sub-label="topCategory ?? ''"
                                />
                                <VisTooltip :triggers="triggers" />
                            </VisSingleContainer>
                        </div>

                        <ul class="flex flex-col gap-3">
                            <li v-for="item in categoryData" :key="item.category" class="text-sm">
                                <span class="text-default font-medium">{{ item.category }}</span>
                                <span class="text-muted">
                                    — ${{ item.total.toFixed(2) }} ({{
                                        Math.round((item.total / totalSpent) * 100)
                                    }}%)
                                </span>
                            </li>
                        </ul>
                    </div>
                </UCard>
            </div>

            <!-- Expenses Table -->
            <div class="px-4 pb-4">
                <UCard>
                    <template #header>
                        <p class="text-base font-semibold text-highlighted">Expenses</p>
                    </template>
                    <UTable
                        :data="expenses ?? []"
                        :columns="expenseColumns"
                        @select="onRowSelect"
                        :ui="{
                            base: 'table-fixed border-separate border-spacing-0',
                            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                            tbody: '[&>tr]:cursor-pointer [&>tr]:last:[&>td]:border-b-0',
                            th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                            td: 'border-b border-default',
                        }"
                    />
                </UCard>
            </div>

            <USlideover v-model:open="isSlideoverOpen" :ui="{ content: 'max-w-lg' }">
                <template #header="{ close }">
                    <div class="w-full flex items-center justify-between shrink-0">
                        <p class="text-base font-semibold text-highlighted truncate">
                            {{ selectedExpense?.merchant ?? 'Expense Detail' }}
                        </p>
                        <div class="flex items-center gap-1.5">
                            <UButton
                                :icon="isEditing ? 'i-lucide-x' : 'i-lucide-pencil'"
                                :label="isEditing ? 'Cancel' : 'Edit'"
                                color="neutral"
                                variant="ghost"
                                size="sm"
                                @click="isEditing = !isEditing"
                            />
                            <UPopover arrow>
                                <UButton
                                    icon="i-lucide-trash-2"
                                    color="error"
                                    variant="ghost"
                                    size="sm"
                                />

                                <template #content>
                                    <div class="p-4 text-right">
                                        <p class="text-sm mb-2 font-semibold">
                                            Delete this expense?
                                        </p>
                                        <UButton
                                            color="error"
                                            :loading="isDeleting"
                                            @click="deleteExpense"
                                        >
                                            Yes
                                        </UButton>
                                    </div>
                                </template>
                            </UPopover>
                        </div>
                    </div>
                </template>
                <template #body="{ close }">
                    <!-- Scrollable body -->
                    <div class="overflow-y-auto">
                        <!-- Receipt image -->
                        <div class="flex justify-center p-4">
                            <img
                                v-if="selectedExpense?.receiptImagePath"
                                :src="`/${selectedExpense.receiptImagePath}`"
                                class="max-h-64 w-auto object-contain rounded-lg border border-default"
                                alt="Receipt"
                            />
                            <div
                                v-else
                                class="h-32 w-full flex flex-col items-center justify-center bg-elevated rounded-lg border border-default gap-2"
                            >
                                <UIcon name="i-lucide-image-off" class="text-muted size-6" />
                                <p class="text-xs text-muted">No receipt image</p>
                            </div>
                        </div>

                        <!-- Expense fields -->
                        <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-xs text-muted uppercase tracking-wide mb-1.5">
                                        Merchant
                                    </p>
                                    <UInput v-if="isEditing" v-model="editForm.merchant" />
                                    <p v-else class="text-sm font-medium">
                                        {{ selectedExpense?.merchant ?? '—' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-muted uppercase tracking-wide mb-1.5">
                                        Category
                                    </p>
                                    <UInput v-if="isEditing" v-model="editForm.category" />
                                    <p v-else class="text-sm font-medium">
                                        {{ selectedExpense?.category ?? '—' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-muted uppercase tracking-wide mb-1.5">
                                        Date
                                    </p>
                                    <UInput v-if="isEditing" v-model="editForm.date" type="date" />
                                    <p v-else class="text-sm font-medium">
                                        {{ selectedExpense?.date ?? '—' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-muted uppercase tracking-wide mb-1.5">
                                        Time
                                    </p>
                                    <UInput v-if="isEditing" v-model="editForm.time" type="time" />
                                    <p v-else class="text-sm font-medium">
                                        {{ selectedExpense?.time?.slice(0, 5) ?? '—' }}
                                    </p>
                                </div>
                                <div class="col-span-2">
                                    <p class="text-xs text-muted uppercase tracking-wide mb-1.5">
                                        Address
                                    </p>
                                    <UInput v-if="isEditing" v-model="editForm.address" />
                                    <p v-else class="text-sm font-medium">
                                        {{ selectedExpense?.address ?? '—' }}
                                    </p>
                                </div>
                                <div class="col-span-2">
                                    <p class="text-xs text-muted uppercase tracking-wide mb-1.5">
                                        Total
                                    </p>
                                    <UInput
                                        v-if="isEditing"
                                        v-model.number="editForm.total"
                                        type="number"
                                        step="0.01"
                                    />
                                    <p v-else class="text-2xl font-bold text-highlighted">
                                        {{
                                            selectedExpense?.total != null
                                                ? `$${selectedExpense.total.toFixed(2)}`
                                                : '—'
                                        }}
                                    </p>
                                </div>
                            </div>

                            <!-- Line items -->
                            <div>
                                <p class="text-xs text-muted uppercase tracking-wide mb-2">
                                    Line Items
                                </p>

                                <!-- Edit mode -->
                                <div v-if="isEditing" class="space-y-2">
                                    <div
                                        v-for="(item, idx) in editForm.items"
                                        :key="idx"
                                        class="flex items-center gap-2"
                                    >
                                        <UInput
                                            v-model="item.name"
                                            placeholder="Item name"
                                            class="flex-1"
                                        />
                                        <UInput
                                            v-model.number="item.quantity"
                                            type="number"
                                            placeholder="Qty"
                                            class="w-16"
                                        />
                                        <UInput
                                            v-model.number="item.price"
                                            type="number"
                                            step="0.01"
                                            placeholder="Price"
                                            class="w-24"
                                        />
                                        <UButton
                                            icon="i-lucide-x"
                                            color="error"
                                            variant="ghost"
                                            size="sm"
                                            @click="removeItem(idx)"
                                        />
                                    </div>
                                    <UButton
                                        icon="i-lucide-plus"
                                        label="Add item"
                                        color="neutral"
                                        variant="ghost"
                                        size="sm"
                                        @click="addItem"
                                    />
                                </div>

                                <!-- View mode -->
                                <template v-else>
                                    <div
                                        v-if="selectedExpense?.items?.length"
                                        class="rounded-lg border border-default divide-y divide-default"
                                    >
                                        <div
                                            v-for="item in selectedExpense.items"
                                            :key="item.id"
                                            class="flex items-center justify-between px-3 py-2 text-sm"
                                        >
                                            <div>
                                                <span class="font-medium">{{ item.name }}</span>
                                                <span
                                                    v-if="item.quantity"
                                                    class="text-muted ml-1.5"
                                                >
                                                    × {{ item.quantity }}
                                                </span>
                                            </div>
                                            <span class="text-muted">
                                                {{
                                                    item.price != null
                                                        ? `$${item.price.toFixed(2)}`
                                                        : '—'
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                    <p v-else class="text-sm text-muted">No line items</p>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Save footer (edit mode only) -->
                <template v-if="isEditing" #footer="{ close }">
                    <div class="w-full flex gap-2 shrink-0">
                        <UButton block :loading="isSaving" @click="saveExpense">
                            Save Changes
                        </UButton>
                        <UButton block color="neutral" variant="outline" @click="close">
                            Cancel
                        </UButton>
                    </div>
                </template>
            </USlideover>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue';
import { Donut } from '@unovis/ts';

import type { Expense, Item } from '~~/shared/types/db';

definePageMeta({
    // middleware: ['auth'],
    layout: 'dashboard',
});

const { user, clear } = useUserSession();

async function logout() {
    await clear();
    await navigateTo('/auth');
}

const { data: expenses, status, error } = await useFetch('/api/expenses');

const totalSpent = computed(
    () => expenses.value?.reduce((acc, curr) => acc + (curr.total ?? 0), 0) ?? 0,
);

type CategoryData = { category: string; total: number };

const categoryData = computed<CategoryData[]>(() => {
    if (!expenses.value?.length) return [];

    const totals = expenses.value.reduce(
        (acc, curr) => {
            const cat = curr.category ?? 'Uncategorized';
            acc[cat] = (acc[cat] ?? 0) + (curr.total ?? 0);
            return acc;
        },
        {} as Record<string, number>,
    );

    return Object.entries(totals)
        .map(([category, total]) => ({ category, total }))
        .sort((a, b) => b.total - a.total);
});

const topCategory = computed(() => categoryData.value[0]?.category ?? null);

const topCategoryPercent = computed(() => {
    if (!categoryData.value.length || !totalSpent.value) return '';
    const pct = (categoryData.value[0]!.total / totalSpent.value) * 100;
    return `${Math.round(pct)}%`;
});

type EditItem = { id?: number; name: string; price: number | null; quantity: number | null };
type ExpenseWithItems = Expense & { items: Item[] };

const isSlideoverOpen = ref(false);
const selectedExpense = ref<ExpenseWithItems | null>(null);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);

const editForm = ref({
    merchant: '',
    category: '',
    date: '',
    time: '',
    address: '',
    total: null as number | null,
    items: [] as EditItem[],
});

function onRowSelect(_e: Event, row: any) {
    selectedExpense.value = row.original as ExpenseWithItems;
    isSlideoverOpen.value = true;
    isEditing.value = false;
}

function addItem() {
    editForm.value.items.push({ name: '', price: null, quantity: null });
}

function removeItem(idx: number) {
    editForm.value.items.splice(idx, 1);
}

async function saveExpense() {
    if (!selectedExpense.value?.id || !expenses.value) return;
    isSaving.value = true;
    try {
        const updated = await $fetch(`/api/expenses/${selectedExpense.value.id}`, {
            method: 'PUT',
            body: editForm.value,
        });
        selectedExpense.value = { ...selectedExpense.value, ...updated } as ExpenseWithItems;
        expenses.value = expenses.value.map((e) =>
            e.id === selectedExpense.value!.id ? { ...e, ...updated } : e,
        );
    } finally {
        isEditing.value = false;
        isSaving.value = false;
    }
}

async function deleteExpense() {
    if (!selectedExpense.value?.id || !expenses.value) return;
    isDeleting.value = true;
    try {
        await $fetch(`/api/expenses/${selectedExpense.value.id}`, { method: 'DELETE' });
        expenses.value = expenses.value.filter((e) => e.id !== selectedExpense.value!.id);
    } catch (e) {
        console.error('Eroor deleting expense', e);
    } finally {
        isSlideoverOpen.value = false;
        selectedExpense.value = null;
        isDeleting.value = false;
    }
}

watch(isSlideoverOpen, (isOpen: boolean) => {
    if (isOpen && selectedExpense.value) {
        editForm.value = {
            merchant: selectedExpense.value?.merchant ?? '',
            category: selectedExpense.value?.category ?? '',
            date: selectedExpense.value?.date ?? '',
            time: selectedExpense.value?.time?.slice(0, 5) ?? '',
            address: selectedExpense.value?.address ?? '',
            total: selectedExpense.value?.total ?? null,
            items: (selectedExpense.value?.items ?? []).map((item: any) => ({
                id: item.id,
                name: item.name ?? '',
                price: item.price ?? null,
                quantity: item.quantity ?? null,
            })),
        };
    }
});

const triggers = {
    [Donut.selectors.segment]: (d: { data: CategoryData }) => d.data.category,
};

const expenseColumns = [
    {
        accessorKey: 'merchant',
        header: 'Merchant',
        cell: ({ row }: { row: any }) => row.getValue('merchant') ?? '—',
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }: { row: any }) => row.getValue('category') ?? '—',
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }: { row: any }) => row.getValue('date') ?? '—',
    },
    {
        accessorKey: 'time',
        header: 'Time',
        cell: ({ row }: { row: any }) => row.getValue('time')?.slice(0, 5) ?? '—',
    },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }: { row: any }) => row.getValue('address') ?? '—',
    },
    {
        accessorKey: 'total',
        header: () => h('div', { class: 'text-right' }, 'Total'),
        cell: ({ row }: { row: any }) => {
            const total = row.getValue('total') as number | null;
            return h(
                'div',
                { class: 'text-right font-medium' },
                total != null ? `$${total.toFixed(2)}` : '—',
            );
        },
    },
];
</script>

<style scoped>
.unovis-single-container {
    --vis-donut-central-label-font-size: 22px;
}
</style>
