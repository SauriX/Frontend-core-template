<template>
    <div class="document-preview">
<!--         <iframe v-if="isBase64" :src="dataUrl" width="100%" height="500px" frameborder="0"></iframe>
        <iframe v-else-if="url" :src="url" width="100%" height="500px" frameborder="0"></iframe>
        <div v-else>No se proporcionó ningún documento para previsualizar.</div> -->
    </div>
</template>

<script setup lang="ts">

import { ref, watch, computed } from 'vue';



const props = defineProps<{
    fileData?: null | null;
    url?: string;
}>();

/* const dataUrl = computed(() => {
    if (props.fileData && props.fileData.base64 && props.fileData.type) {
        if(props.fileData.type!="pdf"){
            console.log("no es pdf");
            return `data: image/${ props.fileData.type };base64,${ props.fileData.base64 }`;
        }
        return `data: application/${ props.fileData.type };base64,${ props.fileData.base64 }`;
    }
    return '';
}); */

/* const isBase64 = computed(() => !!props.fileData?.base64 && !!props.fileData?.type);
 */
watch(() => props.fileData, (newFileData) => {
    if (newFileData) {
        console.log('Datos del archivo recibidos en el preview:', newFileData);
    }
});

watch(() => props.url, (newUrl) => {
    if (newUrl) {
        console.log('URL del documento recibida en el preview:', newUrl);
    }
});
</script>

<style scoped>
.document-preview {
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
}
</style>