import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if(!localStorage.getItem('mediaPath')) next('/setmediapath')
      next()
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "about" */ '../views/Settings.vue'),
    beforeEnter: (to, from, next) => {
      if(!localStorage.getItem('mediaPath')) next('/setmediapath')
      next()
    }
  },
  {
    path: '/setmediapath',
    name: 'SetMediaPath',
    component: () => import(/* webpackChunkName: "setMediaPath" */ '../views/SetMediaPath.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
