import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
 const store = new Vuex.Store({
  state: {},
  getter: {},
  mutations: {},
  actions: {
    addCount(context) {
        console.log(context)
      // 可以包含异步操作
      // context 是一个与 store 实例具有相同方法和属性的 context 对象
    },
  }
})

export default store;