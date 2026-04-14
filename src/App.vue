<template>
  <!-- esperar sesión -->
  <div v-if="!authState.isReady"></div>

  <!-- RUTAS PRIVADAS -->
  <Layout
    v-else-if="route.meta.requiresAuth"
  >
    <router-view />
  </Layout>

  <!-- RUTAS PUBLICAS (login / mfa) -->
  <router-view v-else />

  <ModalsContainer />
  <notifications position="top right" width="50%" />
</template>



<script setup lang="ts">
import "bootstrap/dist/css/bootstrap.min.css"
import { onMounted } from 'vue';
import Layout from '@/components/Layout.vue';
import { ModalsContainer } from 'vue-final-modal'
import { useRoute } from "vue-router";
import { authService, authState } from "@/core/auth/authService";

const route = useRoute()
onMounted(async () => {
  await authService.restoreSession();
});

</script>
<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
