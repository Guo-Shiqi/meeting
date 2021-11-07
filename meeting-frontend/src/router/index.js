import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/',
    name: 'Index',

    component: () => import('../views/Index.vue')
  },
  {
    path: '/join',
    name: 'Join',

    component: () => import('../views/Join.vue')
  },
  {
    path: '/signin',
    name: 'SignIn',

    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',

    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/meeting',
    name: 'Meeting',

    component: () => import('../views/Meeting.vue')
  },
  {
    path: '/room',
    name: 'Room',

    component: () => import('../views/myroom.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
