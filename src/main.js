import Vue from 'vue'
import App from './App'
import router from './router'

import { Menu, MenuItem } from 'element-ui'
Vue.use(Menu)
Vue.use(MenuItem)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
