<template>
    <div class="container-fluid ">
        <div class="mt-3 text-start position-relative">
            <div class="fw-bold text-title pb-2">
                <span ref="titileElement"> {{ title }} </span>
                
            </div>
            <div class="custom-hr" :style="{'--title-width':titleWidth+'px'}"></div>
        </div>
        <div class="d-flex justify-content-between aling-items-center mt-4">
            <div>

            </div>

            <div>
                <button type="button" class="btn btn-success me-2" @click="AddItem">
                    <font-awesome-icon icon="fa-solid fa-plus"/>  Añadir
                </button>
            </div>
        </div>


    </div>
    
</template>
<script lang="ts" setup>
import { nextTick,ref,onMounted,defineProps,defineEmits  } from 'vue';
const props = defineProps({
    title:{
        type:String,
        requiered:true
    },
    icon:{
        type:String,
        requiered:true
    }
});
const titleWidth = ref(0);
const titileElement = ref<HTMLAnchorElement|null>(null);
const emit = defineEmits(["add"]);
onMounted(async ()=>{
    nextTick(()=>{
        if(titileElement.value){
            titleWidth.value = titileElement.value.offsetWidth +6 ;
        }
    });
});
const AddItem = ()=>{
    emit('add');
}
</script>
<style scoped>
    .custom-hr{
        height: 2px;
        width: 100%;
        background-color: #ccc;
        position: relative;
        margin-top: -5px;
    }

    .custom-hr::before{
        content: "";
        height: 2px;
        width: var(--title-width);
        background-color: #31B9D7;
        position: absolute;
        top: 0;
        left: 0;
    }

    .text-title{
        color:#31B9D7;
    }
</style>