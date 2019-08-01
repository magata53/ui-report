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
        component: () => import('../components/Report.vue'),
    },
    {
        name: 'rules',
        path: '/rules',
        meta: {
            requiresAuth: true
        },
        component: () => import('../components/Rules.vue'),
    },
];

const router = new VueRouter({
    routes: menuLink,
    mode: "history",
    base: "/report/"
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