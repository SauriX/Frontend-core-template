/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'highcharts';
declare module "boostrap";
declare module "v-calendar";
declare module "vue-device-detector-js";
declare module "device-uuid";
declare module "platform";
declare module 'bootstrap-vue-next' {
  export function createBootstrap(): any; // o tipar mejor si sabes el retorno,
  export const BButton: any;
  export const BModal: any;
  export const BSpinner:any;
  export const BFormCheckbox:any;
  export const BFormFile:any;
  export function useModal(id: string): {
    show: () => void
    hide: () => void
    modal: any
  }
}
declare module 'vue-select' {
  import { DefineComponent } from 'vue'
  const vSelect: DefineComponent<any, any, any>
  export default vSelect
}

