<template>
  <div class="d-flex flex-column vh-100">
    <div :style="{ width: topbarWidth }" class="topbar d-flex align-items-center justify-content-between p-3">
      <div class="d-flex align-items-center">
        <!-- Icono a la izquierda -->
        <i v-if="isMobile" style="color: #03407F; font-size: xx-large;" class="bi bi-list " @click="toggleSidebar"></i>
        <!-- Logo -->
        <img v-if="isMobile" src="" alt="Logo" @click="goHome" class="topbar-logo mr-2" />
        <!-- Foto de perfil, nombre de usuario y cargo -->
        <div v-if="!isMobile" class="d-flex align-items-center">
          <img v-if="!statusStore.user.userImg" src="../assets/imgs/user-defauld.svg" alt="Profile Picture"
            class="profile-pic mr-2" />
          <img v-if="statusStore.user.userImg" :src="statusStore.user.userImg" alt="Profile Picture"
            class="profile-pic mr-2" />
          <div class="d-flex flex-column ms-2">
            <span class="Username">{{ statusStore.user.nombre || 'Usuario' }}</span>
            <small class="Cargo">{{ statusStore.user.puesto || 'Administración' }}</small>
          </div>
        </div>
      </div>
      <!-- Dropdown de ajustes -->
      <div class="dropdown">
        <i class="bi bi-gear-fill dropdown-toggle" style="color: #50505080;" id="settingsDropdown"
          data-bs-toggle="dropdown" aria-expanded="false"></i>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="settingsDropdown">
          <li><a class="dropdown-item" @click="logout">{{ $t('Logout') }}</a></li>
        </ul>
      </div>
    </div>

    <div class="d-flex flex-grow-1">
      <nav class="sidebar d-flex flex-column pt-3 pb-3 ps-3 pe-0 fixed-left"
        :class="{ 'collapsed': isCollapsed, 'd-none': isMobile && !isCollapsed }">
        <!-- Logo -->
        <div v-if="!isMobile" class="logo-container d-flex align-items-center justify-content-center mb-4"
          @click="goHome">
          <img src="" alt="Logo" class="logo" />
        </div>
        <div :class="{ 'nav-links-container': true, 'collapsed-center': isCollapsed }">
          <router-link v-for="route in routes" :key="route.name" :to="route.path"
            class="d-flex align-items-center nav-link" :class="{ active: $route.name === route.name }"
            v-tippy="{ content:  route.meta?.menuLabelKey ? $t(route.meta.menuLabelKey) : '' , arrow: true, placement: 'right' }">
            <font-awesome-icon class="bi navIcon mb-2" :icon="route.meta!.icon" />
            <span v-if="!isCollapsed" class="nav-text">&nbsp;{{ $t(route.meta?.menuLabelKey ?? '') }}</span>
          </router-link>
          <router-link to="#" class="d-flex align-items-center nav-link" @click="toggleSidebar" v-if="!isMobile"
            v-tippy="{ content: isCollapsed ? $t('menu.expand') : $t('menu.collapse'), arrow: true, placement: 'right' }">
            <i v-if="!isCollapsed" class="bi bi-arrow-bar-left navIcon"></i>
            <i v-if="isCollapsed" class="bi bi-arrow-bar-right navIcon"></i>
            <span v-if="!isCollapsed" class="nav-text">&nbsp;{{ $t('menu.collapse') }}</span>
          </router-link>
        </div>
      </nav>
      <div class="content p-4 flex-grow-1">
        <slot></slot>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup >
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { AppStatusStore } from '../app/stores/AppStatusStore';

import { watch } from 'vue';
import { useModal } from 'vue-final-modal';
import ModalConfirmPlainCss from '@/components/ModalConfirmPlainCss.vue';
import { modalData } from '@/app/models/modal';
import { useAuth } from '@/config/useAuth';
import views from '@/app/util/views';
const statusStore = AppStatusStore();


const isCollapsed = ref(true);
const isMobile = ref(window.innerWidth <= 768);
const router = useRouter();
const selectedCode = ref<string>('');
const routes = computed(() => {
  return router.options.routes.filter(route => route.meta && route.meta.icon && route.meta.show &&
    route.meta.menuLabelKey);
});
var URLogout = `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}/oauth2/logout?post_logout_redirect_uri=${window.location.origin}`;



const topbarWidth = computed(() => {
  if (isMobile.value) {
    return isCollapsed.value ? 'calc(100vw - 80px)' : '100vw';
  } else {
    return isCollapsed.value ? 'calc(100vw - 77px)' : 'calc(100vw - 262px)';
  }
});


const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;

  if (isMobile.value && isCollapsed.value) {

    isCollapsed.value = false;
  } else {
    isCollapsed.value = true;
  }
};
const modaldata = ref(new modalData());
const modalNotice = useModal({
  component: ModalConfirmPlainCss,
  attrs: {
    modaldata: modaldata.value,
    onConfirm() {
      confirmModal();
    },
    onClose() {
      modalNotice.close();
    }
  },
})
const { logout: logoutFromAuth } = useAuth();

const confirmModal = () => {
  window.location.href = URLogout;
  modalNotice.close();


}


const logout = async () => {
  await logoutFromAuth();
  await nextTick(); // Asegura que Vue termine de re-renderizar
  router.push('/login');

}

onMounted(async () => {

  window.addEventListener('resize', handleResize);
  statusStore.getUser();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

watch(isMobile, (newisMobile: boolean) => {
  statusStore.setIsMobileStatus(newisMobile);
}, { deep: true });

const goHome = () => {
  router.push({ name: views.dashboard });
};
</script>
<style scoped>
/* General Layout */
.d-flex.flex-column.vh-100 {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.d-flex.flex-grow-1 {
  display: flex;
  flex-grow: 1;
}

/* Topbar */
.topbar {
  min-width: 246px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  transition: width 0.3s;
  background-color: #F6F9FF;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  height: 56px;
  /* Fixed height for the topbar */
}

.topbar i {
  cursor: pointer;
}

.topbar-logo {
  max-width: 40px;
  max-height: 40px;
  object-fit: cover;
  cursor: pointer;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.Username {
  color: #136891;
  font-family: Inter;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
}

.Cargo {
  font-family: inter;
  color: #023051;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
}

/* Custom Select */
.custom-select {
  background-color: transparent;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #000;
  padding: 0.5rem 2rem 0.5rem 1rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.custom-select:focus {
  border-bottom: 1px solid #000;
  box-shadow: none;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown .dropdown-toggle {
  cursor: pointer;
}

/* Sidebar */
.sidebar {
  width: 260px;
  /* Slightly increased width */
  height: 100vh;
  background-color: #03407F;
  /* Dark blue background */
  transition: width 0.3s;
  position: fixed;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  z-index: 1020;
  padding: 0;
  /* Remove default padding */
}

.sidebar.collapsed {
  width: 77px;
}

/* Sidebar Header (Profile circle and Xwallet) */
.sidebar-header {
  height: 120px;
  /* Adjust height as needed */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
  /* Add padding to align with image */
  padding-bottom: 20px;
  /* Add padding bottom to give space for elements below */
}

.sidebar-header .profile-circle {
  width: 50px;
  /* Size of the circle */
  height: 50px;
  border-radius: 50%;
  background-color: white;
  /* White circle as in the image */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* Prevent shrinking */
}

.sidebar-header .sidebar-username {
  color: white;
  font-size: 1.5rem;
  /* Adjust font size */
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.sidebar.collapsed .sidebar-username {
  display: none;
}

.sidebar.collapsed .profile-circle {
  margin-right: 0 !important;
}


/* Navigation Links */
.nav-links-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-top: 10px;
  /* Space after header */
}

.nav-links-container.collapsed-center {
  align-items: center;
}

.sidebar .nav-link {
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  /* Adjust padding for spacing and visual appeal */
  width: 100%;
  display: flex;
  align-items: center;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 0;
  /* No border-radius by default */
  position: relative;
  /* For active state styling */
}

.sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  /* Light hover effect */
  color: white;
}

.sidebar .nav-link .navIcon {
  font-size: 24px;
  /* Icon size */
  min-width: 30px;
  /* Ensure consistent icon alignment */
  text-align: center;
  color: #8983CF;
  /* Default icon color */
}

.sidebar .nav-link .nav-text {
  margin-left: 15px;
  /* Space between icon and text */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
  /* Font size for navigation text */
  font-weight: 500;
  color: #8983CF;
}

/* Active Navigation Link */
.sidebar .nav-link.active {
  background-color: #F3F9FF;
  /* Orange background for active link */
  color: #E96928;
  /* White text for active link */
  border-radius: 20px 0 0 20px;
  /* Rounded on the right side */
  margin-right: 10px;
  /* Push slightly to the right to create rounded effect */
}

.sidebar .nav-link.active .navIcon {
  color: #8983CF;
  /* White icon for active link */
}


/* Collapsed Sidebar Adjustments */
.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 12px 0;
  /* Adjust padding for collapsed state */
  margin-right: 0;
  /* Remove margin when collapsed */
}

.sidebar.collapsed .nav-link .navIcon {
  margin: 0;
}

.sidebar.collapsed .nav-link .nav-text {
  display: none;
}

.sidebar.collapsed .toggle-sidebar-link {
  justify-content: center;
  margin-top: auto;
  /* Push to bottom */
  position: absolute;
  bottom: 20px;
  width: 100%;
}


/* Content Area */
.content {
  margin-top: 56px;
  /* Height of topbar */
  margin-left: 260px;
  /* Width of expanded sidebar */
  overflow-y: auto;
  height: calc(100vh - 56px);
  width: 100%;
}

.sidebar.collapsed~.content {
  margin-left: 77px;
  /* Width of collapsed sidebar */
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 80px;
    /* Default for mobile, will be controlled by collapsed class */
  }

  .sidebar.collapsed {
    width: 77px;
  }

  .content {
    margin-left: 0px;
  }

  .navbar {
    width: 100%;
  }

  .custom-select {
    overflow: hidden !important;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 150px;
    padding: 0.2rem 0.5rem;
    font-size: 14px;
  }

  .dropdown-menu {
    top: 100%;
    right: 0;
  }

  .sidebar.d-none {
    display: none !important;
  }
}
</style>
