import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import NativeSdk from '../../utils/EventCenter'
import '../../utils/setFontSize'
import { Toast } from 'vant';
import 'vant/lib/toast/style';
import store from '../../vuex/store'
import Router from '../../router/index'


Vue.use(Toast);
const EventCenter = new NativeSdk({
  needRegist: false,
})
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.prototype.Toast = Toast
Vue.prototype.$store = store
Vue.prototype.$eventCenter = EventCenter
Vue.prototype.$isDev = process.env.NODE_ENV === 'development'
Vue.prototype.$isTest = process.env.NODE_ENV === 'test'
Vue.prototype.$eventCenter.setEventCallback(
  'main',
  'init',
  (adInfo) => {
    console.log("这是个init事件回调====",adInfo)
  },
  11
)

Vue.prototype.$eventCenter.setEventCallback('main', 'show', (info) => {
  console.log(info,"这是show回调==")
})

Vue.prototype.$eventCenter.setEventCallback('main', 'afterRegist', () => {
  console.log('这是个afterRegist事件回调')
})
Vue.prototype.$eventCenter.createdSdkEventListeners(['message'])
window.vm = new Vue({
  render: (h) => h(App),
  router:Router
}).$mount('#app')
