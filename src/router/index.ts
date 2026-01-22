import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

import { useAuthStore } from "../stores/auth";

const modules = import.meta.glob("../views/**/**.vue");

const whiteUrl = ["/login"];

const keepAlivePages = ["company"];

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
    path: "/worldmap",
    name: "WorldMap",
    component: () => import("../components/form/WorldMap.vue"),
  },
  {
    path: "/baidumap",
    name: "BaiduMap",
    component: () => import("../components/form/BaiduMap.vue"),
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
        component: () => import("../views/company/Company.vue"),
      },
      {
        path: "/elderly-edit",
        name: "ElderlyEdit",
        meta: {
          title: "新增老人",
        },
        component: () => import("../views/market/ElderlyEdit.vue"),
      },
      {
        path: "/elderly",
        name: "Elderly",
        meta: {
          title: "新增老人",
        },
        component: () => import("../views/market/Elderly.vue"),
      },
      {
        path: "/Role-edit",
        name: "RoleEdit",
        meta: {
          title: "新增角色",
        },
        component: () => import("../views/system/RoleEdit.vue"),
      },
      {
        path: "/Role",
        name: "Role",
        meta: {
          title: "新增角色",
        },
        component: () => import("../views/system/Role.vue"),
      },
      {
        path: "/accountList",
        name: "AccountList",
        meta: {
          title: "账号列表",
        },
        component: () => import("../views/system/Account.vue"),
      },
      {
        path: "/company-add",
        name: "CompanyAdd",
        meta: {
          title: "机构列表",
        },
        component: () => import("../views/company/CompanyAdd.vue"),
      },
      {
        path: "/role",
        name: "Role",
        meta: {
          title: "角色列表",
        },
        component: () => import("../views/system/Role.vue"),
      },
      {
        path: "/role-add",
        name: "RoleAdd",
        meta: {
          title: "新增角色",
        },
        component: () => import("../views/system/RoleAdd.vue"),
      },
      {
        path: "/address",
        name: "Address",
        meta: {
          title: "地址管理",
        },
        component: () => import("../views/care/Address.vue"),
      },
      {
        path: "/purchase-detail/:id",
        name: "PurchaseDetail",
        meta: {
          title: "采购申请详情",
        },
        props: true,
        component: () => import("../views/diet/PurchaseDetail.vue"),
      },
      {
        path: "/discharge",
        name: "discharge",
        meta: {
          title: "出院管理",
        },
        props: true,
        component: () => import("../views/market/Discharge.vue"),
      },
      //
      {
        path: "position-edit/:id",
        name: "position-edit/:id",
        meta: {
          title: "修改岗位",
        },
        props: true,
        component: () => import("../views/personel/AddPost.vue"),
      },
      {
        path: "/position-add",
        name: "AddPost",
        meta: {
          title: "新增岗位",
        },
        props: true,
        component: () => import("../views/personel/AddPost.vue"),
      },
      {
        path: "/staff-add",
        name: "staff-ad",
        meta: {
          title: "新增护工",
        },
        props: true,
        component: () => import("../views/personel/AddStaff.vue"),
      },
      {
        path: "/staff-edit/:id",
        name: "AddStaff",
        meta: {
          title: "编辑护工",
        },
        props: true,
        component: () => import("../views/personel/AddStaff.vue"),
      },
      {
        path: "/elderly-records",
        name: "ElderlyRecords",
        component: () => import("../views/market/ElderlyRecords.vue"),
      },
      {
        path: "/elderly-work",
        name: "ElderlyWork",
        component: () => import("../views/market/ElderlyWork.vue"),
      },
      {
        path: "GoOut",
        name: "GoOut",
        meta: {
          title: "外出登记",
        },
        props: true,
        component: () => import("../views/care/GoOut.vue"),
      },
      {
        path: "addGoOut",
        name: "addGoOut",
        meta: {
          title: "新增外出登记",
        },
        props: true,
        component: () => import("../views/care/addGoOut.vue"),
      },
      {
        path: "/priceanalysis",
        name: "PriceAnalysis",
        props: true,
        component: () => import("../views/diet/PriceAnalysis.vue"),
      },
      {
        path: "/AddPurchase",
        name: "AddPurchase",
        meta: {
          title: "新增采购申请",
        },
        component: () => import("../components/logistics/AddPurchase.vue"),
      },
      {
        path: "/check/:id",
        name: "check",
        meta: {
          title: "收获验收",
        },
        component: () => import("../views/logistics/check.vue"),
      },
      {
        path: "/details/:id",
        name: "details",
        meta: {
          title: "查看详情",
        },
        component: () => import("../views/logistics/details.vue"),
      },
      {
        path: "/medicalcareAdd",
        name: "medicalcareAdd",
        component: () => import("../views/medicalcare/MedicalcareAddOld.vue"),
      },
      {
        path: "/medicalcaredetails",
        name: "medicalcaredetails",
        component: () => import("../views/medicalcare/MedicalcareDetails.vue"),
      },
      {
        path: "/medicalcarePlanset",
        name: "medicalcarePlanset",
        component: () => import("../views/medicalcare/MedicalcarePlanset.vue"),
      },
    ],
  },
  // 新增：匹配所有未定义的路由，防止刷新后匹配不到路由跳转404或异常页面
  {
    path: "/:pathMatch(.*)*",
    redirect: "/", // 或根据需求重定向到404页面
  },
];

const router = createRouter({
  history: createWebHashHistory("/dist"),
  routes,
});

// 新增：标记动态路由是否已添加，避免重复添加
let hasAddedDynamicRoutes = false;

router.beforeEach(async (to, from) => {
  console.log("to前往的页面", to);
  console.log("from从哪个页面过来", from);

  // 白名单页面直接放行
  if (whiteUrl.includes(to.path)) {
    return true;
  }

  const authStore = useAuthStore();
  const token = authStore.token;

  // 无token则跳转登录页
  if (!token) {
    return "/login";
  }

  // 核心优化1：判断是否已添加动态路由，避免重复添加
  if (!hasAddedDynamicRoutes) {
    try {
      //  获取权限列表
      const res = await authStore.getMenu();
      console.log("权限列表", res);

      // 动态添加路由
      res.forEach((item) => {
        item.children.forEach((child) => {
          if (child.pathName) {
            const component =
              modules[`../views/${item.url}/${child.pathName}.vue`];
            if (!component) return; // 避免组件不存在导致报错
            console.log(
              `${child.name}../views/${item.url}/${child.pathName}.vue`,
              `${item.url}/${child.url}`,
            );
            router.addRoute("Home", {
              path: `/${item.url}/${child.url}`,
              name: child.url + child.id,
              meta: {
                menuColor: "#4080FF",
                path: item.children[0].url,
                name: item.name,
                childrenName: child.name,
                pathBtn: child.url,
                menusFath: item.url,
                keepAlive: keepAlivePages.includes(item.url),
                parent: {
                  name: item.name,
                  childrenName: child.name,
                  pathBtn: child.url,
                  menusFath: item.url,
                  keepAlive: keepAlivePages.includes(item.url),
                  parent: {
                    name: item.name,
                    url: "/care/" + `${item.url}/${child.url}`,
                  }, // 修复parent.url中parent未定义的问题
                  current: {
                    name: child.name,
                    url: "/care/" + `${item.url}/${child.url}`,
                  },
                  url: "/care/" + `${item.url}/${child.url}`,
                }, // 修复parent.url中parent未定义的问题
                current: {
                  name: child.name,
                  url: "/care/" + `${item.url}/${child.url}`,
                },
              },
              component: component,
            });
          }
        });
      });
      // 标记动态路由已添加，防止重复执行
      hasAddedDynamicRoutes = true;
      console.log("路由列表", router.getRoutes());

      let path = to.redirectedFrom?.fullPath || to.fullPath;

      return path;
    } catch (error) {
      console.error("获取权限列表或添加动态路由失败：", error);
      // 异常时清除token并跳转登录
      authStore.token; // 需在authStore中实现清除token的方法
      return "/login";
    }
  }
  // 动态路由已添加，直接放行
  return true;
});

router.afterEach((to: any) => {
  document.title = to.meta.title || "乐康智慧养老";
});

export default router;
