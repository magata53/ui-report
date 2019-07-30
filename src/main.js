import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/router.js'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import Layout from './components/Layout.vue'
import Default from './components/Default.vue'

Vue.use(VueCookies)
Vue.component('layout', Layout);
Vue.component('default', Default);
Vue.prototype.$cookies = VueCookies;
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
