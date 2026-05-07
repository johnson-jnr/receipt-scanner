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
                            leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
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
                            leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
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
                            leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <span class="text-2xl font-semibold text-highlighted">
                            {{ topCategory ?? '—' }}
                        </span>
                    </UPageCard>
                </UPageGrid>
            </div>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="ts">
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

const totalSpent = computed(() => {
    return expenses.value?.reduce((acc, curr) => acc + (curr.total ?? 0), 0) ?? 0;
});

const topCategory = computed(() => {
    if (!expenses.value?.length) return null;

    const totals = expenses.value.reduce(
        (acc, curr) => {
            const cat = curr.category ?? 'Uncategorized';
            acc[cat] = (acc[cat] ?? 0) + (curr.total ?? 0);
            return acc;
        },
        {} as Record<string, number>,
    );

    return Object.entries(totals).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;
});
</script>

<style scoped></style>
