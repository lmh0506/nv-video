import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import {
  Menu,
  MenuItem,
  Form,
  FormItem,
  Input,
  Button,
  Checkbox
} from 'element-ui'

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Checkbox)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
