<template>
    <button class="btn btn-back mt-4" @click="goBack"><font-awesome-icon icon="circle-left"/> Regresar</button>
</template>
<script lang="ts" setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['back']);

const goBack =() =>{
    emit("back");
}
</script>
<style scoped>
.btn-back {
    color: #136891;
    border-color: #136891;
}

.btn-back:hover {
    color: #136891;
    border-color: #136891;
}

</style>