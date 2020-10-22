import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import { auth } from '../firebase'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './assets/scss/index.scss'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueAxios, axios)

let app
auth.onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      store,
      router,
      render: h => h(App),
    }).$mount('#app')
  }
})

