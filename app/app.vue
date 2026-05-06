<script setup lang="ts">
const toaster = { position: 'top-right' } as const;
</script>

<template>
    <NuxtLayout>
        <UApp :toaster="toaster">
            <NuxtPage />
        </UApp>
    </NuxtLayout>
</template>
