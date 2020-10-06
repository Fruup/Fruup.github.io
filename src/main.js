import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

// load tracks
import { db } from './db.js'
db.loadTracks()

// use gtag plugin
import VueGtag from 'vue-gtag'

const id = process.env.NODE_ENV === 'development' ?
  "UA-157501117-2" : // development property
  "UA-157501117-1"; // production property
const enabled = process.env.NODE_ENV === 'development' ?
  true : // always enable in dev mode
  false; // only enable if user constented

Vue.use(VueGtag, {
    config: {
      id,
      anonymize_ip: true,
    },
    enabled,
    onBeforeTrack() {
      console.log("About to track something ", arguments);
    },
    onAfterTrack() {
      console.log("Tracked something ", arguments);
    }
  },
  router // hook up router to gtag
);

// create vue
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
