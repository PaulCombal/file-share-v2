import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Search from './views/Search.vue'
import ShowSubmission from './views/ShowSubmission'
import ShowUser from './views/ShowUser'
import Login from './views/Login'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/search',
            name: 'search',
            component: Search
        },
        {
            path: '/u/:username',
            name: 'show_user',
            component: ShowUser
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/:id/:slug',
            name: 'show_submission',
            component: ShowSubmission
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
