import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  //   {
  //     path: '/',
  //     name: 'Home',
  //     component: () => import('../views/Home.vue'),
  //     children:[
  //       {
  //         path: '/About',
  //         name: 'About',
  //         meta: {
  //           keepAlive: false
  //         },
  //         component: () => import('../views/About.vue')
  //       }
  //     ]
  //   },
  {
    path: "/",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("../views/login/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
