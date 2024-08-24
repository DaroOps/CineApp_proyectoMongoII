import { createWebHistory, createRouter } from 'vue-router'
import  authGuard  from '@auth/authGuard.js';

import App from '@pages/App/App.vue'
// import Categories from '@pages/App/Categories/index.vue'
import Home from '@pages/App/Home/Home.vue'
// import Designs from '@pages/App/Designs/index.vue'
// import Profile from '@pages/App/Profile/index.vue'
import CinemaSelection from '@pages/App/CinemaSelection/CinemaSelection.vue'
import Book from '@pages/App/Book/Book.vue'
import Summary from '@pages/App/Summary/Summary.vue'
import Profile from '@pages/App/Profile/Profile.vue'
import TicketSwiper from '@pages/App/TicketSwiper/TicketSwiper.vue'

import Login from '@pages/Login/Login.vue'
import Register from '@pages/Register/Register.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/app',
    redirect: '/app/home',
    name: 'App',
    meta: { requiresAuth: true },
    component: App,
    children: [
      {
        path: '/app/home',
        name: 'AppHome',
      
        component: Home,
        meta:{ requiresNav: true }
      },
      {
        path: '/app/search',
        name: 'AppSearch',
        component: Home,
        meta:{ requiresNav: true }
      },
      {
        path: '/app/tickets',
        name: 'AppTickets',
        component: Home,
        meta:{ requiresNav: true }
      },
      { path: '/app/profile', name: 'AppProfile',
        component: Profile,
        meta:{ requiresNav: true }
      },
      {
        path: '/app/c-s:id',
        component: CinemaSelection,
        meta:{ requiresNav: false },
      },
      {
        path: '/app/b-n:id',
        name: 'BookNow',
        component: Book,
        meta:{ requiresNav: false }
      },
      {
        path: '/app/summary',
        name: 'OrderSummary',
        component: Summary,
        meta:{ requiresNav: false }
      },
      {
        path: '/app/ticket-swiper',
        name: 'TiketSwiper',
        component: TicketSwiper,
        meta:{ requiresNav: false }
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authGuard);

export default router