<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
            <template #header="{ collapsed }">
                <!-- <Logo v-if="!collapsed" class="h-5 w-auto shrink-0" />
              <UIcon v-else name="i-simple-icons-nuxtdotjs" class="size-5 text-primary mx-auto" /> -->

                <UIcon name="i-lucide-receipt-text" class="size-4 shrink-0" />
                <span v-if="!collapsed">Receipt Scanner</span>
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
