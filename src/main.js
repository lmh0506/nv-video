import Vue from 'vue'
import App from './App'
import router from './router'

import {
  Menu,
  MenuItem,
  Form,
  FormItem,
  Input,
  Button
} from 'element-ui'

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
