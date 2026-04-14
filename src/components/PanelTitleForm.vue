<template>
    <div class="card">
        <div class="card-body">
            <div class="mt-3 text-start position-relative">
                <div class="fw-bold text-title pb-2">
                    <span ref="titileElement">
                        <font-awesome-icon :icon="icon" class="me-2" />{{ title }}
                    </span>
                </div>
                <div class="custom-hr" :style="{ '--title-width': titleWidth + 'px' }"></div>
            </div>
        </div>

        <div class="container mb-4">
            <slot></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
import { nextTick, ref, onMounted, defineProps, defineEmits } from 'vue';
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
});

const titleWidth = ref(0);
const titileElement = ref<HTMLAnchorElement | null>(null);
const emit = defineEmits(["add"]);
onMounted(() => {
    if (titileElement.value) {
        titleWidth.value = titileElement.value.offsetWidth + 6;
    }
});

</script>
<style scoped>
.custom-hr {
    height: 2px;
    width: 100%;
    background-color: #ccc;
    position: relative;
    margin-top: -5px;
}

.custom-hr::before {
    content: "";
    height: 2px;
    width: var(--title-width);
    background-color: #31B9D7;
    position: absolute;
    top: 0;
    left: 0;
}

.text-title {
    color: #31B9D7;
    font-size: 18.72px;
}


.card {
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
</style>