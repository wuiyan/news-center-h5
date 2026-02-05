// 路由信息

import { createRouter, createWebHistory } from 'vue-router'
import Login from '../view/Login.vue'
import Register from '../view/Register.vue'
import Index from '../view/Index.vue'
import Profile from '../view/Profile.vue'
import ProfileEdit from '../view/ProfileEdit.vue'
import Settings from '../view/Settings.vue'
import About from '../view/About.vue'


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/index', component: Index },
    {
        path: '/profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/edit',
        component: ProfileEdit,
        meta: { requiresAuth: true }
    },
    {
        path: '/settings',
        component: Settings,
        meta: { requiresAuth: true }
    },
    {
        path: '/about',
        component: About
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const user = localStorage.getItem('user');

    if (to.meta.requiresAuth && !user) {
        next('/login');
    } else if ((to.path === '/login' || to.path === '/register') && user) {
        next('/index');
    } else {
        next();
    }
});

export default router