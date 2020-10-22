import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/App.vue'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Asteroid from '@/components/Asteroid'
import { auth } from '../../firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Main,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/browse/:id',
    name: 'asteroid-detail',
    component: Asteroid,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
