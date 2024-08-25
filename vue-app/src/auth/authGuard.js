import { useAuthStore } from '@stores/auth.js';


export default async function authGuard(to, from, next) {
  const authStore = useAuthStore();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = await authStore.checkAuth();
    
    if (!isAuthenticated) {
      console.log('Redirecting to login by authGuard ;)');
      
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