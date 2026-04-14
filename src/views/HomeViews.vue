<template>
  <div class="home">
  </div>
</template>

<script lang="ts" setup>

import { onMounted } from 'vue';

import router from '@/router';
import { authService } from '@/core/auth/authService';

onMounted(async ()=>{
  await authService.restoreSession();
  router.push('/')

})


</script>
