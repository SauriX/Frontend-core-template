<template>
    <div class="loader-container">
        <div v-if="loading" class="overlay">
            <div class="page-loader d-flex align-items-center justify-content-center">
                <span class="spinner-border text-primary" role="status"></span>
                <span class="text-gray-800 fs-6 fw-semibold ms-2">{{ message }}</span>
            </div>
        </div>
        <div :class="{ 'blurred-content': loading }">
            <slot></slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    loading: { type: Boolean, required: true },
    message: { type: String, default: 'Cargando...' } // Changed default message to Spanish
});
</script>
<style scoped>
.loader-container {
    position: relative;
    /* Needed for absolute positioning of the overlay */
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    /* Semi-transparent white overlay */
    z-index: 10;
    /* Ensure overlay is above the content */
    display: flex;
    align-items: center;
    justify-content: center;
}

.blurred-content {
    filter: blur(4px);
    /* Adjust blur strength as needed */
    pointer-events: none;
    /* Prevents interaction with blurred content */
}

/* Styles for the spinner and message inside the overlay */
.page-loader {
    background-color: rgba(0, 0, 0, 0.7);
    /* Darker background for the loader itself */
    padding: 15px 30px;
    border-radius: 8px;
    color: white;
    /* Text color for the message */
}</style>