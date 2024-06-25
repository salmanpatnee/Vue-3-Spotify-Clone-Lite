import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const Home = () => import('@/views/HomeView.vue')
const Manage = () => import('@/views/ManageView.vue')
const Track = () => import('@/views/TrackShow.vue')

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home
  },
  {
    name: 'manage',
    path: '/manage',
    component: Manage,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/manage-music',
    redirect: { name: 'manage' }
  },
  {
    path: '/track/:id',
    name: 'track.show',
    component: Track
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500'
})

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
  } else {
    const user = useUserStore()

    user.isLoggedIn ? next() : next({ name: 'home' })
  }
})

export default router
