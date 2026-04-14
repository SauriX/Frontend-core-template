<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Panel izquierdo -->
      <aside class="left">
        <!-- Ilustración SVG (mano + tarjeta) -->
        <img src="@/assets/imgs/hand.svg" class="img"/>
      </aside>

      <!-- Panel derecho -->
      <main class="right">
        <h1>{{ t('welcome') }}</h1>

        <p class="subtitle">{{ t('login.subtitle') }}</p>
        <Loader :loading="loading">
          <div v-if="supportsStrategySwitch" class="strategy-switcher">
            <button
              v-for="strategy in availableStrategies"
              :key="strategy.name"
              type="button"
              class="strategy-button"
              :class="{ active: currentStrategyName === strategy.name }"
              @click="switchStrategy(strategy.name)"
            >
              {{ strategy.name === 'msal' ? 'Microsoft Entra ID' : 'Acceso personalizado' }}
            </button>
          </div>

          <button v-if="currentStrategyName === 'msal'" class="button" type="button" @click="loginWithMsal">
            Continuar con Microsoft
          </button>

          <form v-else class="form" @submit.prevent="login">

            <label class="label" for="email">{{ t('login.email_label') }}</label>
            <input type="email" v-model="loginRequest.username" class="form-control"
              :class="{ 'is-invalid': hasError('username', errors) }" :placeholder="t('login.email_placeholder')"
              autocomplete="email">
            <div v-if="hasError('username', errors)" class="error-message">
              {{ getErrorMessage('username', errors) }}
            </div>
            <label class="label" for="password">{{ t('login.password_label') }}</label>
            <input type="password" v-model="loginRequest.password" class="form-control"
              :class="{ 'is-invalid': hasError('username', errors) }" :placeholder="t('login.password_placeholder')"
              autocomplete="current-password">
            <div v-if="hasError('password', errors)" class="error-message">
              {{ getErrorMessage('password', errors) }}
            </div>

            <button class="button" type="submit">{{ t('login.button') }}</button>
          </form>
        </Loader>
      </main>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue';
import Loader from '@/components/Loader.vue';

// Define LoginRequest locally because the legacy agent model file was removed
class LoginRequest {
  username: string;
  password: string;

  constructor(username: string = '', password: string = '') {
    this.username = username;
    this.password = password;
  }
}

import { useRouter } from 'vue-router';
import { CustomError } from '@/app/models/errors';
import { validateObjectProperties, hasError, getErrorMessage } from '@/app/util/helpers';
import { LoginRequestModelSchema } from '@/app/validators/loginFormValidationSchema';
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import { useAuth } from '@/config/useAuth';
import type { AuthStrategyName } from '@/core/auth/types';

const { t, locale } = useI18n({ useScope: 'global' });
const loading = ref(false);
const router = useRouter();
const loginRequest: LoginRequest = new LoginRequest('', '');
const errors = ref<CustomError[]>([]);
const { login: authLogin, setStrategy, currentStrategyName, availableStrategies } = useAuth();
const supportsStrategySwitch = availableStrategies.value.length > 1;


onMounted(() => {
  console.log('Locale actual:', locale.value);
  console.log('Traducción welcome:', t('welcome'));
});


watch(loginRequest, (newLoginRequest) => {
  if (errors.value.length > 0) {
    errors.value = validateObjectProperties(newLoginRequest, LoginRequestModelSchema);
  }
}, { deep: true });

const login = async () => {
  errors.value = validateObjectProperties(loginRequest, LoginRequestModelSchema);
  if (errors.value.length > 0) {
    return;
  }

  let isSuccess: boolean = false;
  loading.value = true;
  await authLogin({
    username: loginRequest.username,
    password: loginRequest.password,
  }).then(v => {
    isSuccess = v;
  }).catch(e => {
    isSuccess = e;
  });;
  loading.value = false;

  if (isSuccess && isSuccess === true)
    router.push('/mfa');


}

const loginWithMsal = async () => {
  loading.value = true;
  await authLogin();
  loading.value = false;
};

const switchStrategy = async (strategyName: AuthStrategyName) => {
  await setStrategy(strategyName);
};

</script>
  
<style scoped>

.img{
  max-width: 90%;
}
/* Layout general */
.login-page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #eef3f8;
  padding: 24px;
}

.login-card {
  width: min(100%, 1040px);
  min-height: 540px;
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(6, 59, 115, 0.15);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
}

/* Panel izquierdo (azul) */
.left {
  background: #063b73;
  /* azul profundo */
  position: relative;
  display: flex; /* Habilita Flexbox en el contenedor */
  justify-content: center; /* Centra los elementos hijos horizontalmente */
  align-items: center; /* Centra los elementos hijos verticalmente */
}

.art {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Panel derecho (formulario) */
.right {
  padding: 48px 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  margin: 0 0 8px;
  font-size: 28px;
  color: #0c294a;
  font-weight: 800;
}

.subtitle {
  margin: 0 0 28px;
  color: #334155;
  font-size: 14px;
}

.form {
  display: grid;
  gap: 14px;
}

.strategy-switcher {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.strategy-button {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #0c294a;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
}

.strategy-button.active {
  background: #0a3a71;
  color: #ffffff;
  border-color: #0a3a71;
}

.label {
  font-size: 13px;
  color: #243447;
  font-weight: 600;
}

.input {
  height: 44px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f3f4f6;
  padding: 0 14px;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.input:focus {
  background: #ffffff;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.15);
}

.button {
  margin-top: 18px;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: #0a3a71;
  color: #ffffff;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.04s ease, filter 0.2s ease, background 0.2s ease;
}

.button:hover {
  filter: brightness(1.05);
}

.button:active {
  transform: translateY(1px);
}

/* Responsive */
@media (max-width: 900px) {
  .login-card {
    grid-template-columns: 1fr;
  }

  .left {
    display: none;
    /* oculta ilustración en móviles para ganar espacio */
  }

  .right {
    padding: 32px 24px;
  }
}


.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}

.status-active {
  background-color: #28a745;
}

/* Verde */
.status-inactive {
  background-color: #dc3545;
}

/* Rojo */
</style>
  
