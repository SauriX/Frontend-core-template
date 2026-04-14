import { defineStore,storeToRefs } from 'pinia'
import { Ref, ref } from 'vue';
import { User } from '../models/User';
export const AppStatusStore = defineStore('appStatus',{
  
  state:()=> ({
    isMobile: window.innerWidth <= 768,
    isLoading :false,
    user:new User(),
  }),
  actions:{
    setIsMobileStatus(status:boolean){
      this.isMobile= status;
    },
    setIsLoadingStatus(status:boolean){
      this.isLoading= status;
    },getUser(){
      //const userJson = localStorage.getItem('user');
      //const user = JSON.parse(userJson||"");
      //this.user.nombre= user.name
      //this.user.puesto = user.username
    }
  }

})