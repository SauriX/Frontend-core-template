<script setup lang="ts">
import TransportationType from '@/app/util/TransportationType';
import { VueFinalModal } from 'vue-final-modal'
import { PropType } from 'vue'
import { modalData } from '@/app/models/modal';
import { AppStatusStore } from '@/app/stores/AppStatusStore';
import { storeToRefs } from 'pinia';
const { isMobile } = storeToRefs(AppStatusStore());
const emit = defineEmits(['Confirm', 'Close']);

const props = defineProps({
  modaldata: { type: Object as PropType<modalData> },

});

const emitClose = ()=>{
  emit('Close');
}

const emitConfirm = () =>{
  emit('Confirm');
}
</script>

<template>
  <VueFinalModal class="confirm-modal" :content-class="'confirm-modal-content '+ (!isMobile?'modal-width':'')"  overlay-transition="vfm-fade"
    content-transition="vfm-fade" :clickToClose="false">
    <div class="container">
      <div class="row row-cols-auto justify-content-center">
        <div class="col-12 text-end"><i @click="emitClose" class="bi bi-x-circle icon-modal"></i></div>
        <div class="col-12 text-center">
          <h1 class="title-icon-modal" :class="modaldata?.theme"> <i :class="'bi ' + modaldata?.icon"></i></h1>
        </div>
        <div class="col-12 text-center">
          <h1 :class="modaldata?.theme">{{ modaldata?.title }}</h1>
        </div>

        <div class="col-12 text-center mt-3" v-for="parrafo in modaldata?.parrafos!" v-html="parrafo">
          
        </div>

        <div class="col-4" :class="modaldata.ShowOk ? 'text-end' : 'text-center'" v-if="modaldata?.showCancel">
          <button @click="emitClose" class="btn btn-modal-cancel mt-3">{{ modaldata?.canceltext }}</button>
        </div>
        <div class="col-4" :class="modaldata.showCancel ? 'text-start' : 'text-center'" v-if="modaldata?.ShowOk">
          <button @click="emitConfirm" class="btn btn-modal-ok mt-3">{{ modaldata?.oktext }}</button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<style>
.confirm-modal {
  display: flex;
  justify-content: center;
  align-items: center;

}

.confirm-modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  height: fit-content;
}

.modal-width{
  max-width: 40%;
}

.confirm-modal-content>*+* {
  margin: 0.5rem 0;
}

.dark .confirm-modal-content {
  background: #000;
}

.icon-modal:hover {
  cursor: pointer;
}

.title-icon-modal {
  font-size: 500% !important;
}

.warning {
  color: #FFC107;
}

.error {
  color:#DC3545;
}

.success{
  color:#28A745;
}
.btn-modal-ok {
  background-color: #136891;
  color: white;
  border: #136891;
}

.btn-modal-ok:hover {
  background-color: #004F78;
  color: white;
  border: #136891;
}

.btn-modal-ok:active {
  background-color: #00355E !important;
  color: white !important;
  border: #00355E;
}
.btn-modal-cancel {
  background-color: #6C757D;
  color: white;
  border: #6C757D;
}

.btn-modal-cancel:hover {
  background-color: #535C64 !important;
  color: white !important;
  border: #535C64 !important;
}

.btn-modal-ocancel:active {
  background-color: #39424A !important;
  color: white !important;
  border: #39424A;
}


</style>
