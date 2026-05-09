<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
            <template #header="{ collapsed }">
                <div
                    class="flex items-center gap-1.5 py-1.5 w-full"
                    :class="collapsed ? 'justify-center' : 'px-2.5'"
                >
                    <UIcon name="i-lucide-receipt-text" class="size-5 shrink-0" />
                    <span v-if="!collapsed" class="font-medium text-sm truncate"
                        >Receipt Scanner</span
                    >
                </div>
            </template>

            <template #default="{ collapsed }">
                <UNavigationMenu :collapsed="collapsed" :items="items[0]" orientation="vertical" />
            </template>

            <template #footer="{ collapsed }">
                <UserMenu :collapsed="collapsed" />
            </template>
        </UDashboardSidebar>

        <slot />
    </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items: NavigationMenuItem[][] = [
    [
        {
            label: 'Upload Receipt',
            icon: 'i-lucide-upload-cloud',
            to: '/dashboard/upload',
        },
        {
            label: 'Dashboard',
            icon: 'i-lucide-house',
            to: '/dashboard',
        },
    ],
];
</script>
