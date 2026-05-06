<template>
    <div>Single expense</div>
</template>

<script setup lang="ts">
const route = useRoute();

const { data: expense, status, error } = await useFetch(`/api/expenses/${route.params.id}`);
</script>

<style scoped></style>
