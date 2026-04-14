// router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ExampleDashboardView from '../views/ExampleDashboardView.vue';
import HomeViews from '../views/HomeViews.vue';
import ExampleEntitiesView from '../views/ExampleEntitiesView.vue';
import ExampleFormView from '../views/ExampleFormView.vue';
import TemplateGuideView from '../views/TemplateGuideView.vue';
import routeNames from '@/app/util/routeNames';
import views from '@/app/util/views'; // Asegúrate de que esta ruta sea correcta
import LoginView from '../views/LoginView.vue';
import MFAView from '../views/MFAView.vue';
import { authService } from '@/core/auth/authService';
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean;
    icon: string;
    show: boolean;
    menuLabelKey?: string;
  }
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: routeNames.login,
    component: LoginView,
    meta: {
      requiresAuth: false,
      icon: '',
      show: false,
      menuLabelKey: ''
    }
  },
  {
    path: '/mfa',
    name: routeNames.mfa,
    component: MFAView,
    meta: {
      requiresAuth: false,
      icon: 'fa-solid fa-house',
      show: false,
      menuLabelKey: ''
    }
  },
  { 
    path: '/', 
    name: routeNames.dashboard,
    component: ExampleDashboardView,
    meta:{
      requiresAuth: true,
      icon: 'fa-solid fa-house',
      show: true,
      menuLabelKey: 'menu.home', // CLAVE DE TRADUCCIÓN
    } 
  },
  {
    path: '/authentication/login-callback',
    name: routeNames.auth,
    component: HomeViews,
    meta: {
      requiresAuth: false,
      icon: '',
      show: false,
      menuLabelKey: ''
    },
  },
  {
    path: '/entities',
    name: routeNames.entities,
    component: ExampleEntitiesView,
    meta: {
      requiresAuth: true,
      icon: 'fa-solid fa-table-list',
      show: true,
      menuLabelKey: 'menu.entities',
    }
  },
  {
    path: '/forms',
    name: routeNames.forms,
    component: ExampleFormView,
    meta: {
      requiresAuth: true,
      icon: 'fa-solid fa-pen-ruler',
      show: true,
      menuLabelKey: 'menu.forms',
    }
  },
  {
    path: '/guide',
    name: routeNames.guide,
    component: TemplateGuideView,
    meta: {
      requiresAuth: true,
      icon: 'fa-solid fa-book-open',
      show:true,
      menuLabelKey: 'menu.guide',
    }
  }, 
  {
    path: '/resources/:resourceId',
    name: 'resourceDetail',
    component: TemplateGuideView,
    props: true,
    meta: {
      requiresAuth: true,
      icon: 'fa-exchange',
      show:false,
      menuLabelKey: ''
    }
  }, 
]
//Levels
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  await authService.restoreSession();
  const isAuthenticated = await authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login');
  }

  if (to.name === views.login && isAuthenticated) {
    return next('/');
  }

  next();
});


export default router
