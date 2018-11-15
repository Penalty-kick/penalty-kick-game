import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/loby',
      name: 'loby',
      component: () => import('./views/Loby.vue')
    },
    {
      path: '/room',
      name: 'room',
      component:() => import('./views/Room.vue')
    },
    {
      path: '/gameboard',
      name: 'gameboard',
      component: () => import('./views/Gameboard.vue')
    },
  ]
})
