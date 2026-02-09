// 路由信息

import { createRouter, createWebHistory } from 'vue-router'
import Login from '../view/auth/Login.vue'
import Register from '../view/auth/Register.vue'
import Index from '../view/Index.vue'
import Profile from '../view/profile/Profile.vue'
import ProfileEdit from '../view/profile/ProfileEdit.vue'
import Settings from '../view/profile/Settings.vue'
import FollowingList from '../view/profile/FollowingList.vue'
import FollowersList from '../view/profile/FollowersList.vue'
import CollectList from '../view/profile/CollectList.vue'
import About from '../view/other/About.vue'
import Detail from '../view/content/Detail.vue'
import Publish from '../view/content/Publish.vue'
import Articlestats from '../view/content/Articlestats.vue'
import UserDetail from '../view/content/UserDetail.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/index', component: Index },
    { path: '/detail', component: Detail },
    { path: '/user/detail', component: UserDetail },
    { path: '/publish', component: Publish },
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
        path: '/profile/following',
        component: FollowingList,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/followers',
        component: FollowersList,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/collect',
        component: CollectList,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/articlestats',
        component: Articlestats
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