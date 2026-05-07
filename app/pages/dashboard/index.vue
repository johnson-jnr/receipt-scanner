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
                        :ui="{
                            base: 'table-fixed border-separate border-spacing-0',
                            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                            tbody: '[&>tr]:last:[&>td]:border-b-0',
                            th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                            td: 'border-b border-default',
                        }"
                    />
                </UCard>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue';
import { Donut } from '@unovis/ts';

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
