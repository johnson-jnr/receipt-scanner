<template>
    <!-- <div>Content page</div> -->
    <UFileUpload
        v-model="localFiles"
        multiple
        accept="image/*"
        label="Drop your Recept here"
        class="w-96 min-h-48"
        layout="list"
    >
        <!-- <template #actions="{ open }">
            <UButton
                label="Select images"
                icon="i-lucide-upload"
                color="neutral"
                variant="outline"
                @click="open()"
            />
        </template> -->

        <!-- <template #files-bottom="{ removeFile, files }">
            <UButton
                v-if="files?.length"
                label="Remove all files"
                color="neutral"
                @click="removeFile()"
            />
        </template> -->

        <template #files="{ files }">
            <UModal v-for="(file, index) in files" :key="file.name">
                <div
                    class="hover:bg-neutral-50 relative text-xs px-2.5 py-1.5 gap-1.5 min-w-0 flex items-center border border-default rounded-md w-full"
                >
                    <UAvatar
                        :as="{ img: 'img' }"
                        :src="createObjectUrl(file)"
                        :icon="'i-lucide-file'"
                        data-slot="fileLeadingAvatar"
                    />

                    <div data-slot="fileWrapper" class="flex flex-col min-w-0 flex-1">
                        <span data-slot="fileName" class="truncate text-sm font-medium">
                            {{ file.name }}
                        </span>
                        <span data-slot="fileSize" class="text-xs text-muted">
                            {{ formatFileSize(file.size) }}
                        </span>
                    </div>

                    <UButton
                        color="neutral"
                        variant="link"
                        :trailing-icon="'i-lucide-x'"
                        :aria-label="`Remove ${file.name}`"
                        data-slot="fileTrailingButton"
                        @click.stop.prevent="removeFileAt(index)"
                    />
                </div>

                <template #content>
                    <div class="h-72 m-4">
                        <img
                            :src="createObjectUrl(file)"
                            class="object-contain w-full h-full"
                            alt=""
                        />
                    </div>
                </template>
            </UModal>
            <!-- <div
                v-for="(file, index) in files"
                :key="file.name"
                data-slot="file"
                class="hover:bg-neutral-50 relative text-xs px-2.5 py-1.5 gap-1.5 min-w-0 flex items-center border border-default rounded-md w-full"
            >
                <UAvatar
                    :as="{ img: 'img' }"
                    :src="createObjectUrl(file)"
                    :icon="'i-lucide-file'"
                    data-slot="fileLeadingAvatar"
                />

                <div
                    @click="viewFile(file)"
                    data-slot="fileWrapper"
                    class="flex flex-col min-w-0 flex-1"
                >
                    <span data-slot="fileName" class="truncate text-sm font-medium">
                        {{ file.name }}
                    </span>
                    <span data-slot="fileSize" class="text-xs text-muted">
                        {{ formatFileSize(file.size) }}
                    </span>
                </div>

                <UButton
                    color="neutral"
                    variant="link"
                    :trailing-icon="'i-lucide-x'"
                    :aria-label="`Remove ${file.name}`"
                    data-slot="fileTrailingButton"
                    @click.stop.prevent="removeFileAt(index)"
                />
            </div> -->
        </template>
    </UFileUpload>

    <UButton
        @click="scanReceipt"
        class="mt-8"
        color="neutral"
        v-if="localFiles.length && !expenses.length"
    >
        Scan Receipt
    </UButton>

    <template v-if="expenses.length">
        <UTable
            v-model:expanded="expanded"
            class="mt-5"
            :data="expenses"
            :columns="columns"
            :ui="{ td: 'p-1!' }"
        >
            <template #expanded="{ row }">
                <UTable
                    :data="row.original.items"
                    :columns="itemColumns"
                    :ui="{ td: 'p-1!' }"
                    class="ml-10 my-2"
                />
            </template>
        </UTable>

        <UButton @click="saveExpense" class="mt-8" color="neutral"> Save Expense </UButton>
    </template>
</template>

<script setup lang="ts">
const localFiles = ref<File[]>([]);
const openFileModal = ref(false);

const UInput = resolveComponent('UInput');
const UButton = resolveComponent('UButton');

const expanded = ref({});
let expenses = ref([]);

const data = ref([
    { name: 'John Doe', email: 'john@example.com', amount: 100 },
    { name: 'Jane Smith', email: 'jane@example.com', amount: 200 },
]);

const columns = [
    {
        id: 'expand',
        cell: ({ row }) =>
            h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                icon: 'i-lucide-chevron-down',
                square: true,
                'aria-label': 'Expand',
                ui: {
                    leadingIcon: [
                        'transition-transform',
                        row.getIsExpanded() ? 'duration-200 rotate-180' : '',
                    ],
                },
                onClick: () => row.toggleExpanded(),
            }),
    },
    {
        accessorKey: 'merchant',
        header: 'Merchant',
        cell: ({ row }: { row: { original: { merchant: string } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.merchant,
                'onUpdate:modelValue': (value: string) => {
                    row.original.merchant = value;
                },
            });
        },
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }: { row: { original: { category: string } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.category,
                'onUpdate:modelValue': (value: string) => {
                    row.original.category = value;
                },
            });
        },
    },
    {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ row }: { row: { original: { address: string } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.address,
                'onUpdate:modelValue': (value: string) => {
                    row.original.address = value;
                },
            });
        },
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }: { row: { original: { date: string } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.date,
                type: 'date',
                'onUpdate:modelValue': (value: string) => {
                    row.original.date = value;
                },
            });
        },
    },
    {
        accessorKey: 'time',
        header: 'Time',
        cell: ({ row }: { row: { original: { time: string } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.time?.slice(0, 5),
                type: 'time',
                'onUpdate:modelValue': (value: string) => {
                    row.original.time = value;
                },
            });
        },
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }: { row: { original: { total: number } } }) => {
            return h(UInput, {
                class: 'w-full',
                modelValue: row.original.total,
                type: 'number',
                'onUpdate:modelValue': (value: string | number) => {
                    row.original.total = Number(value);
                },
            });
        },
    },
];

const itemColumns = [
    {
        accessorKey: 'name',
        header: 'Item',
        cell: ({ row }: { row: { original: { name: string } } }) =>
            h(UInput, {
                class: 'w-full',
                modelValue: row.original.name,
                'onUpdate:modelValue': (value: string) => {
                    row.original.name = value;
                },
            }),
    },
    {
        accessorKey: 'quantity',
        header: 'Qty',
        cell: ({ row }: { row: { original: { quantity: number } } }) =>
            h(UInput, {
                class: 'w-full',
                modelValue: row.original.quantity,
                type: 'number',
                'onUpdate:modelValue': (value: string | number) => {
                    row.original.quantity = Number(value);
                },
            }),
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }: { row: { original: { price: number } } }) =>
            h(UInput, {
                class: 'w-full',
                modelValue: row.original.price,
                type: 'number',
                'onUpdate:modelValue': (value: string | number) => {
                    row.original.price = Number(value);
                },
            }),
    },
];

function removeFileAt(index: number) {
    if (localFiles.value.length) {
        localFiles.value.splice(index, 1);
    }
}

const scanReceipt = async () => {
    const form = new FormData();
    localFiles.value.forEach((file) => form.append('files', file));

    const result = await $fetch('/api/scan', {
        method: 'POST',
        body: form,
    });

    expenses.value = result;
    console.log(result);
};

const saveExpense = async () => {
    const result = await $fetch('/api/expense', {
        method: 'POST',
        body: expenses.value,
    });

    console.log(result);
};
</script>

<style scoped></style>
