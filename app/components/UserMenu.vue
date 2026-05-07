<script setup lang="ts">
defineProps<{ collapsed: boolean }>()

const { user, clear } = useUserSession()

async function logout() {
    await clear()
    await navigateTo('/auth')
}
</script>

<template>
    <UDropdownMenu
        :items="[
            [
                {
                    label: user?.name ?? 'Account',
                    icon: 'i-lucide-circle-user-round',
                },
            ],
            [
                {
                    label: 'Log out',
                    icon: 'i-lucide-log-out',
                    color: 'error',
                    onSelect: logout,
                },
            ],
        ]"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
    >
        <UButton
            v-bind="{
                label: collapsed ? undefined : user?.name ?? 'Account',
                trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
            }"
            variant="ghost"
            block
            :avatar="{ icon: 'i-lucide-circle-user-round', size: 'xl' }"
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed' }"
        />
    </UDropdownMenu>
</template>
