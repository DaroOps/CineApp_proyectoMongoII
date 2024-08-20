import { createWebHistory, createRouter } from 'vue-router'

import App from '@pages/App/App.vue'
// import Categories from '@pages/App/Categories/index.vue'
import Home from '@pages/App/Home/Home.vue'
// import Designs from '@pages/App/Designs/index.vue'
// import Profile from '@pages/App/Profile/index.vue'
import CinemaSelection from '@pages/App/CinemaSelection/CinemaSelection.vue'
import Book from '@pages/App/Book/Book.vue'
import Summary from '@pages/App/Summary/Summary.vue'

import Login from '@pages/Login/Login.vue'
import Register from '@pages/Register/Register.vue'

const routes = [
  {
    path: '/',
    redirect: '/iniciar-sesion'
  },
  {
    path: '/iniciar-sesion',
    name: 'Login',
    component: Login
  },
  {
    path: '/registrarse',
    name: 'Register',
    component: Register
  },
  {
    path: '/app',
    name: 'App',
    component: App,
    children: [
      {
        path: '/app/',
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
        component: Home,
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
        path: '/app/summary:id',
        name: 'OrderSummary',
        component: Summary,
        meta:{ requiresNav: false }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router