export default defineEventHandler(async (event) => {
    const form = await readFormData(event);

    const response = await $fetch("http://127.0.0.1:8000/scan", {
        method: "POST",
        body: form,
    });

    return response;
});
