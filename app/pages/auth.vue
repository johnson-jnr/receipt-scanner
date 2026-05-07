<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';

const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
    name: z.string('Name is required').min(2, 'Too short!'),
});

type Schema = z.output<typeof schema>;

const registerForm = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
    name: undefined,
});

const loginForm = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
    name: undefined,
});

const items: TabsItem[] = [
    {
        label: 'Login',
        slot: 'login',
    },
    {
        label: 'Register',
        slot: 'register',
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
    <div class="h-10/12 flex items-center">
        <div class="max-w-sm mx-auto w-full">
            <div v-if="formError" class="text-sm text-red-500 mb-4">{{ formError }}</div>
            <UTabs :items="items">
                <template #register>
                    <UForm
                        :schema="schema"
                        :state="registerForm"
                        class="space-y-4"
                        @submit="onRegister"
                    >
                        <UFormField label="Name" name="name">
                            <UInput
                                class="w-full"
                                v-model="registerForm.name"
                                placeholder="John Doe"
                            />
                        </UFormField>

                        <UFormField label="Email" name="email">
                            <UInput class="w-full" v-model="registerForm.email" />
                        </UFormField>

                        <UFormField label="Password" name="password">
                            <UInput
                                class="w-full"
                                v-model="registerForm.password"
                                type="password"
                            />
                        </UFormField>

                        <UButton class="w-full justify-center" type="submit"> Submit </UButton>
                    </UForm>
                </template>
                <template #login>
                    <UForm :schema="schema" :state="loginForm" class="space-y-4" @submit="onLogin">
                        <UFormField label="Email" name="email">
                            <UInput class="w-full" v-model="loginForm.email" />
                        </UFormField>

                        <UFormField label="Password" name="password">
                            <UInput class="w-full" v-model="loginForm.password" type="password" />
                        </UFormField>

                        <UButton class="w-full justify-center" type="submit"> Submit </UButton>
                    </UForm>
                </template>
            </UTabs>
            <div class="mt-4 text-center">
                <UButton variant="ghost" @click="navigateTo('/dashboard')">See Demo</UButton>
            </div>
        </div>
    </div>
</template>
