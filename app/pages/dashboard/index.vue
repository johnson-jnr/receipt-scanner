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
            <div class="h-full">foo</div>
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
