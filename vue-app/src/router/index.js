import { createWebHistory, createRouter } from 'vue-router'

// import App from '@pages/App/App.vue'
// import Categories from '@pages/App/Categories/index.vue'
// import Home from '@pages/App/Home/index.vue'
// import Designs from '@pages/App/Designs/index.vue'
// import Profile from '@pages/App/Profile/index.vue'

import Login from '@pages/Login/Login.vue'
// import Register from '@pages/Register/Register.vue'

const routes = [
  {
    path: '/',
    redirect: '/iniciar-sesion'
  },
  {
    path: '/iniciar-sesion',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router