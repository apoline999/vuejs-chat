import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/Home.vue'
import AdminPage from '../views/Admin.vue'
import AdminLoginPage from '../views/AdminLogin.vue'
import AdminListChatPage from '../views/AdminListChat.vue'
import AboutPage from '../views/About.vue'
import RegisterPage from '../views/Register.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,

  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    children: [
      { path: 'login', component: AdminLoginPage },
      { path: 'chat-list', component: AdminListChatPage }
    ],
  },

  // otherwise redirect to home
  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// MiddleWare to check if the route need an Authenticated user
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
      return;
    }
    if (store.getters.isAuthenticated && store.getters.StateUser.isAdmin ) {
      next("/admin/login");
    }
    else {
      next("/");
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/admin/chat-list");
      return;
    }
    next();
  } else {
    next();
  }
});

export default router
