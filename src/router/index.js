import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/AboutPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/SignupPage.vue'),
    },
    {
      path: '/party/list',
      name: 'partyList',
      component: () => import('@/pages/party/PartyListPage.vue'),
    },
    {
      path: '/party/register',
      name: 'partyRegister',
      component: () => import('@/pages/party/PartyRegisterPage.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('auth') === 'true';

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login');
  }

  if (to.path === '/login' && isLoggedIn) {
    return next('/');
  }

  next();
});
export default router;
