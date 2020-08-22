import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// load tracks
import { db } from './db.js'
db.loadTracks()

// create vue?
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
