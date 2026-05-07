<template>
    <nav class="container px-6! py-4">
        <NuxtLink
            to="/"
            aria-label="Go to home"
            class="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-transparent transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
            <span
                class="flex size-8 items-center justify-center rounded-md bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition group-hover:bg-slate-200 group-hover:text-slate-950"
            >
                <UIcon name="i-lucide-receipt-text" class="size-4" />
            </span>
            <span>Receipt Scanner</span>
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts"></script>

<style scoped></style>
