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
                    <div class="h-64 m-4">
                        <img :src="createObjectUrl(file)" class="w-full h-full" alt="" />
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

    <UButton @click="scanReceipt" class="mt-8" color="neutral" v-if="localFiles.length">
        Scan Receipt
    </UButton>
</template>

<script setup lang="ts">
const localFiles = ref<File[]>([]);
const openFileModal = ref(false);

function removeFileAt(index: number) {
    if (localFiles.value.length) {
        localFiles.value.splice(index, 1);
    }
}

const scanReceipt = async () => {
    const form = new FormData();
    localFiles.value.forEach((file) => form.append("files", file));

    const result = await $fetch("/api/scan", {
        method: "POST",
        body: form,
    });

    console.log(result);
};
</script>

<style scoped></style>
