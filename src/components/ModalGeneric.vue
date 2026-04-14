<template>
    <BModal v-model="visible" :id="modalId" :title="title" :no-close-on-backdrop="true" :no-close-on-esc="true" :no-header-close="true" :size="size">
        <!-- Aquí va el contenido del modal -->
        <slot />

        <!-- Aquí personalizamos los botones OK y Cancel -->
        <template #footer>
            <BButton v-if="showCancel" @click="handleCancel" variant="secondary">{{ cancelTitle }}</BButton>
            <BButton v-if="showOk" @click="handleOk" variant="primary">{{okTitle }}</BButton>
        </template>
    </BModal>
</template>
<script setup lang="ts">
import { ref,defineEmits,defineProps } from 'vue'
import { BModal, BButton } from 'bootstrap-vue-next'

defineProps<{
    modalId: string
    title: string
    cancelTitle?: string
    okTitle?: string,
    showOk?:boolean ,
    showCancel?:boolean,
    size?: string,
}>()

const visible = ref(false)

const emit = defineEmits(['cancel','ok']);
// Función para manejar el clic en el botón Cancelar
function handleCancel() {
    emit("cancel");
}

// Función para manejar el clic en el botón OK
function handleOk() {
    emit("ok");
}
</script>