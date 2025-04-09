import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
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
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/ProfilePage.vue'),
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
    {
      path: '/finance/register',
      name: 'financeRegister',
      component: () => import('@/pages/FinanceRegisterPage.vue'),
    },
    {
      path: '/finance/list',
      name: 'financeList',
      component: () => import('@/pages/FinanceListPage.vue'),
    },
    {
      path: '/finance/edit/:id',
      name: 'FinanceEdit',
      component: () => import('@/pages/FinanceEditPage.vue'),
      meta: { requiresAuth: true },
    {
      path: '/random',
      name: 'random',
      component: () => import('@/pages/RandomLunchPage.vue'),
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
