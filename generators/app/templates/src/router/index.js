import VueRouter from 'vue-router'
import Vue from 'vue'
import videoPage from '../components/video-page/index.vue'
import IntegralWall from '../components/Integral-wall/index.vue'
Vue.use(VueRouter)


// 2.创建VueRouter对象
const routes = [
    {
      name:"home",
      path: '/',
      component: videoPage,
    },
    {
      name:"IntegralWall",
      path: '/IntegralWall',
      component: IntegralWall
    }
  ]

  const router = new VueRouter({
    // 配置路由和组件之间的应用关系
    routes,
    mode: 'history'
  })
  router.beforeEach((to, from, next) => {
    next();
  });

  // 3.将router对象传入到Vue实例
export default router
   