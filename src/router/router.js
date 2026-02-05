// 路由信息

import { createRouter, createWebHistory } from 'vue-router'
import Login from '../view/Login.vue'
import Register from '../view/Register.vue'
import Index from '../view/Index.vue'


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/index', component: Index },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router