import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
