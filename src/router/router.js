// 路由信息

import { createRouter, createWebHistory } from 'vue-router'
import Login from '../view/Login.vue'
import Register from '../view/Register.vue'
import Index from '../view/Index.vue'
import Profile from '../view/Profile.vue'
import ProfileEdit from '../view/ProfileEdit.vue'
import Settings from '../view/Settings.vue'
import About from '../view/About.vue'
import Detail from '../view/Detail.vue'


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/index', component: Index },
    { path: '/detail', component: Detail },
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



export default router