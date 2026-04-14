<template>
  <div class="mfa-page">
    <div class="mfa-card">
      <aside class="left">
        <img src="@/assets/imgs/card.svg" class="img" />
      </aside>

      <main class="right">
        <h1>{{ $t('mfa.title') }}</h1>
        <p class="subtitle">{{ $t('mfa.subtitle') }}</p>
        <p class="email">{{ email }}</p>

        <Loader :loading="loading">
          <div class="form">

            <label class="label" for="otp">{{ $t('mfa.label') }}</label>

            <input type="mfa" v-model="otpRequest.otp" class="form-control"
              :class="{ 'is-invalid': hasError('otp', errors) }" :placeholder="$t('mfa.placeholder')">
            <div v-if="hasError('otp', errors)" class="error-message">
              {{ getErrorMessage('otp', errors) }}
            </div>

            <div class="resend-section">
              <p v-if="timerActive" class="timer-text">
                {{ $t('mfa.resend_timer', { seconds: timer }) }}
              </p>
              <button v-else @click="resendCode" :disabled="loading" class="resend-button">
                {{ $t('mfa.resend_button') }}
              </button>
            </div>


            <button class="button" @click="verifyOtp">
              {{ $t('mfa.verify_button') }}
            </button>

          </div>
        </Loader>
      </main>
    </div>
  </div>
</template>
 
<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import router from '@/router';
import Loader from '@/components/Loader.vue';
import { CustomError } from '@/app/models/errors';
import { validateObjectProperties, hasError, getErrorMessage } from '@/app/util/helpers';
import { OtpRequestModelSchema } from '@/app/validators/loginFormValidationSchema';
// Define OtpRequest class locally since the original was removed
class OtpRequest {
  otp: string;
  constructor(otp= '') {
    this.otp = otp;
  }
}
import { useAuth } from '@/config/useAuth';

const loading = ref(false);
const errors = ref<CustomError[]>([]);
const email = ref('');

const otpRequest: OtpRequest = new OtpRequest('');
const { activeStrategy, verifyOtp: verifyOtpByStrategy } = useAuth();
const verifyOtp = async () => {
  if (!activeStrategy.value.supportsMfa) {
    router.push('/login');
    return;
  }

  errors.value = validateObjectProperties(otpRequest, OtpRequestModelSchema);
  if (errors.value.length > 0) {
    return;
  }
  loading.value = true;
  let user = await verifyOtpByStrategy(otpRequest.otp);
  if (user) {
    router.push('/');
  }
  loading.value = false;
}

watch(otpRequest, (newOtpRequest) => {
  if (errors.value.length > 0) {
    errors.value = validateObjectProperties(newOtpRequest, OtpRequestModelSchema);
  }
}, { deep: true });

// Lógica para el temporizador
const timer = ref(30);
const timerActive = ref(true);

let timerInterval: any = null;
const startTimer = () => {
  timer.value = 10;
  timerActive.value = true;
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(timerInterval as number);
      timerInterval = null;
      timerActive.value = false;
    }
  }, 1000);
};

const resendCode = async () => {
  console.log('Reenviando código...');
  startTimer();
};

// Iniciar el temporizador cuando el componente se monta
onMounted(() => {
  if (!activeStrategy.value.supportsMfa) {
    router.push('/login');
    return;
  }

  const storedLoginRequest = localStorage.getItem('custom_login_request');
  if (storedLoginRequest) {
    try {
      const parsed = JSON.parse(storedLoginRequest);
      email.value = parsed?.username ?? '';
    } catch {
      email.value = '';
    }
  }

  startTimer();
});

// Limpiar el temporizador para evitar fugas de memoria
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>
 
<style scoped>
/* Estilos existentes... */
.mfa-page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  background: #eef3f8;
  padding: 24px;
}

.mfa-card {
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
  display: flex;
  /* Habilita Flexbox en el contenedor */
  justify-content: center;
  /* Centra los elementos hijos horizontalmente */
  align-items: center;
  /* Centra los elementos hijos verticalmente */
}

.img {
  max-width: 90%;
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

.email {
  margin: 0 0 28px;
  color: #063b73;
  font-size: 14px;
}

.form {
  display: grid;
  gap: 14px;
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

/* Estilos para el temporizador y el botón de reenvío */
.resend-section {

  text-align: center;
}

.timer-text {
  font-size: 14px;
  color: #6b7280;
}

.resend-button {
  background: none;
  border: none;
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.resend-button:hover {
  text-decoration: underline;
  color: #2563eb;
}

/* Responsive */
@media (max-width: 900px) {
  .mfa-card {
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
</style>
