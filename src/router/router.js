import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const menuLink = [
    {
        name: 'login',
        path: '/',
        meta: {
            layout: "default",
            requiresAuth: false
        },
        component: () => import('../components/Login.vue'),
    },
    {
        name: 'report',
        path: '/reports',
        meta: {
            requiresAuth: true
        },
        component: () => import('../components/report/Report.vue'),
    },
    {
        name: 'rules',
        path: '/rules',
        meta: {
            requiresAuth: true
        },
        component: () => import('../components/report/Rules.vue'),
    },
    {
        name: 'scheduler',
        path: '/scheduler',
        meta: {
            requiresAuth: true
        },
        component: () => import('../components/scheduler/Scheduler.vue'),
    },
    {
        name: 'calendar',
        path: '/calendar',
        meta: {
            requiresAuth: true
        },
        component: () => import('../components/scheduler/Calendar.vue'),
    },
];

const router = new VueRouter({
    routes: menuLink,
    mode: "history",
    base: "/ui/"
});

/* eslint-disable */
router.beforeEach((to, from, next) => {
    if(to.matched.some(route => route.meta.requiresAuth)){
        if($cookies.isKey("token")){
            next()
        }else{
            next('/');
        }
    }else{
        next();
    }

})

export default router;