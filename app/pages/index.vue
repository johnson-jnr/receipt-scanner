<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, TabsItem } from '@nuxt/ui';

const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(6, 'Must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
    name: z.string('Name is required').min(2, 'Too short!'),
    currency: z.string('Currency is required'),
});

type LoginSchema = z.output<typeof loginSchema>;
type RegisterSchema = z.output<typeof registerSchema>;

const currencyOptions = getCurrencyOptions();

const registerForm = reactive<Partial<RegisterSchema>>({
    email: undefined,
    password: undefined,
    name: undefined,
    currency: undefined,
});

const loginForm = reactive<Partial<LoginSchema>>({
    email: undefined,
    password: undefined,
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

const { fetch: fetchSession } = useUserSession();
const toast = useToast();
const formError = ref<string | null>(null);
const loadingSignin = ref(false);
const loadingSignup = ref(false);
const loadingDemo = ref(false);

async function onDemo() {
    loadingDemo.value = true;
    try {
        await $fetch('/api/auth/demo', { method: 'POST' });
        await fetchSession();
        await navigateTo('/dashboard');
    } catch {
        toast.add({
            title: 'Demo unavailable',
            description: 'Please try again later.',
            color: 'error',
        });
    } finally {
        loadingDemo.value = false;
    }
}

async function onRegister(event: FormSubmitEvent<RegisterSchema>) {
    loadingSignup.value = true;
    formError.value = null;

    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: event.data,
        });

        await fetchSession();
        toast.add({
            title: 'Success',
            description: 'Account created',
            color: 'success',
        });

        await navigateTo('/dashboard/upload');
    } catch (err: any) {
        formError.value = err.data?.message;
    } finally {
        loadingSignup.value = false;
    }
}

async function onLogin(event: FormSubmitEvent<LoginSchema>) {
    loadingSignin.value = true;
    formError.value = null;

    try {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: event.data,
        });

        await fetchSession();
        await navigateTo('/dashboard/upload');
    } catch (err: any) {
        formError.value = err.data?.message;
    } finally {
        loadingSignin.value = false;
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
                        :schema="registerSchema"
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

                        <UFormField label="Currency" name="currency">
                            <USelectMenu
                                v-model="registerForm.currency"
                                :items="currencyOptions"
                                value-key="code"
                                class="w-full"
                            />
                        </UFormField>

                        <UButton
                            :loading="loadingSignup"
                            class="w-full justify-center"
                            type="submit"
                        >
                            Submit
                        </UButton>
                    </UForm>
                </template>
                <template #login>
                    <UForm
                        :schema="loginSchema"
                        :state="loginForm"
                        class="space-y-4"
                        @submit="onLogin"
                    >
                        <UFormField label="Email" name="email">
                            <UInput class="w-full" v-model="loginForm.email" />
                        </UFormField>

                        <UFormField label="Password" name="password">
                            <UInput class="w-full" v-model="loginForm.password" type="password" />
                        </UFormField>

                        <UButton
                            :loading="loadingSignin"
                            class="w-full justify-center"
                            type="submit"
                        >
                            Submit
                        </UButton>
                    </UForm>
                </template>
            </UTabs>
            <div class="mt-4 text-center">
                <UButton variant="ghost" :loading="loadingDemo" @click="onDemo">See Demo</UButton>
            </div>
        </div>
    </div>
</template>
