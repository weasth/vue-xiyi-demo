import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
// import vueKeyboard from 'vue2-keyboard'

Vue.prototype.$axios = axios
Vue.config.productionTip = false
// Vue.use(vueKeyboard)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
