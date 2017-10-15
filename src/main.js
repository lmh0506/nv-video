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
  Submenu,
  Row,
  MenuItemGroup,
  Col,
  Aside,
  Main,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  MessageBox,
  Message,
  Pagination
} from 'element-ui'

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Submenu)
Vue.use(Row)
Vue.use(Col)
Vue.use(MenuItemGroup)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)

Vue.config.productionTip = false

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$message = Message

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
