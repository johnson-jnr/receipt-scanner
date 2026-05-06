<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';

const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
});

const items: TabsItem[] = [
    {
        label: 'Register',
        slot: 'register',
    },
    {
        label: 'Login',
        slot: 'login',
    },
];

const toast = useToast();
const formError = ref<string | null>(null);

async function onRegister(event: FormSubmitEvent<Schema>) {
    formError.value = null;

    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: event.data,
        });

        toast.add({
            title: 'Success',
            description: 'Account created',
            color: 'success',
        });

        await navigateTo('/dashboard');
    } catch (err: any) {
        formError.value = err.data?.message;
    }
}

async function onLogin(event: FormSubmitEvent<Schema>) {
    formError.value = null;

    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: event.data,
        });

        await navigateTo('/dashboard');
    } catch (err: any) {
        formError.value = err.data?.message;
    }
}
</script>

<template>
    <div class="max-w-sm">
        <div v-if="formError" class="text-sm text-red-500 mb-4">{{ formError }}</div>
        <UTabs :items="items">
            <template #register>
                <UForm :schema="schema" :state="state" class="space-y-4" @submit="onRegister">
                    <UFormField label="Email" name="email">
                        <UInput class="w-full" v-model="state.email" />
                    </UFormField>

                    <UFormField label="Password" name="password">
                        <UInput class="w-full" v-model="state.password" type="password" />
                    </UFormField>

                    <UButton class="w-24 justify-center" type="submit"> Submit </UButton>
                </UForm>
            </template>
            <template #login>
                <UForm :schema="schema" :state="state" class="space-y-4" @submit="onLogin">
                    <UFormField label="Email" name="email">
                        <UInput class="w-full" v-model="state.email" />
                    </UFormField>

                    <UFormField label="Password" name="password">
                        <UInput class="w-full" v-model="state.password" type="password" />
                    </UFormField>

                    <UButton class="w-24 justify-center" type="submit"> Submit </UButton>
                </UForm>
            </template>
        </UTabs>
    </div>
</template>
