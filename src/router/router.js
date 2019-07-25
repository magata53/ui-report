import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const menuLink = [
    {
        name: 'hello-world',
        path: '/',
        component: () => import('../components/HelloWorld.vue'),
    }
];

const router = new VueRouter({
    routes: menuLink,
    mode: "history",
    base: "/report/"
});

export default router;