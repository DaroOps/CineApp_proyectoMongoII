import { useAuthStore } from '@stores/auth.js';

export default async function authGuard(to, from, next) {
  const authStore = useAuthStore();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    await authStore.checkAuth();
    
    if (!authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
}