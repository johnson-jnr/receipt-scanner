<template>
    <div class="min-h-screen grid grid-flow-row grid-rows-[auto_1fr_auto]">
        <Nav />
        <main class="container mx-auto">
            <slot />
        </main>
        <Footer />
    </div>
</template>
