import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import { useAuthStore } from "../stores/auth";

const whiteUrl = ["/login"];

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
    },
    component: () => import("../views/login/Login.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("../views/home/Home.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          title: "首页",
        },
        component: () => import("../views/home/HomeView.vue"),
      },
      {
        path: "/company",
        name: "Company",
        meta: {
          title: "机构列表",
        },
        component: () => import("../views/home/company.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  console.log("to前往的页面", to);
  console.log("from从哪个页面过来", from);
  console.log("next放行");

  if (whiteUrl.includes(to.path)) {
    return true;
  }

  const authStore = useAuthStore();

  const token = authStore.token;
  if (!token) {
    return "/login";
  }
});

router.afterEach((to: any) => {
  document.title = to.meta.title || "乐康智慧养老";
});

export default router;
