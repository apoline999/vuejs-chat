import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// Axios is a JS library used to send API requests

// Send requests with credentials
// axios.defaults.withCredentials = true,
axios.defaults.baseURL = 'http://localhost:3000/';
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


Vue.config.productionTip = false
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

// Middleware to redirect user if 404
axios.interceptors.response.use(undefined, function (error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
  		originalRequest._retry = true;
      store.dispatch('LogOut')
      return router.push('/admin/login')
    }
  }
})