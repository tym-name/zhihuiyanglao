<template>
  <!-- 原有 logo 结构不变 -->
  <div class="logo">
    <img src="../../assets/image/login/logo.png" alt="">
    <div class="title">乐康智慧养老系统</div>
  </div>
  <div class="text">
    <div class="titles" @click="router.push('/homeview')"><i style="margin-left: -26px;margin-right: 5px;" class="iconfont icon-shouye"></i>首页</div>
    <!-- 给 el-menu 绑定 select 事件，用于监听菜单点击 -->
    <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleMenuSelect">
      <!-- 1. 直接展示的子菜单（父级被扁平化，无 el-sub-menu 包裹） -->
      <el-menu-item :index="`/${flatMenu.parentUrl}/${flatMenu.url}`" v-for="flatMenu in flatMenus" :key="flatMenu.id">
        <el-icon>
          <span class="iconfont" :class="flatMenu.icon || flatMenu.parentIcon"></span>
        </el-icon>
        <span>{{ flatMenu.name }}</span>
      </el-menu-item>

      <!-- 2. 保留原父级结构的菜单（子菜单数量 > 1） -->
      <el-sub-menu :index="item.id" v-for="item in normalMenus" :key="item.id">
        <template #title>
          <el-icon>
            <span class="iconfont" :class="item.icon"></span>
          </el-icon>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item :index="`/${item.url}/${subItem.url}`" v-for="subItem in item.children" :key="subItem.id">
          <span class="iconfont" :class="subItem.icon"></span>
          {{ subItem.name }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import type { MenuItem } from '../../api/index/indexType';
// 1. 引入 Vue Router 相关钩子
import { useRouter } from 'vue-router';

const store = useAuthStore()
// 2. 获取路由实例
const router = useRouter()

// 原始菜单数据
const rawMenus = ref<MenuItem[]>([])
// 扁平化后的菜单（父级children长度为1时的子菜单）
const flatMenus = ref<any[]>([])
// 正常保留父级的菜单（父级children长度 !== 1）
const normalMenus = ref<MenuItem[]>([])

onMounted(async () => {
  await store.getMenu()
  rawMenus.value = store.meuns // 注意：变量名 meuns 疑似笔误（应为 menus）
  handleMenuData() // 预处理菜单数据
})

// 核心：菜单数据预处理函数
const handleMenuData = () => {
  // 重置数据，防止重复处理
  flatMenus.value = []
  normalMenus.value = []

  if (!rawMenus.value.length) return

  rawMenus.value.forEach(parentMenu => {
    // 校验父级是否有 children 且为数组
    const children = parentMenu.children || []
    if (children.length === 1) {
      // 子菜单唯一：扁平化处理，提取子菜单并携带父级信息
      const onlyChild = children[0]
      flatMenus.value.push({
        ...onlyChild,
        parentId: parentMenu.id, // 父级ID
        parentUrl: parentMenu.url, // 父级URL（用于拼接路由index）
        parentIcon: parentMenu.icon // 父级图标（可选：子菜单无图标时使用父级图标）
      })
    } else {
      // 子菜单数量 !== 1：保留原父级结构
      normalMenus.value.push({
        ...parentMenu
      })
    }
  })
}

// 3. 菜单选中（点击）事件处理函数：实现路由跳转
const handleMenuSelect = (index: string) => {
  // index 即为 el-menu-item 绑定的 :index 值（路由路径）
  if (index) {
    // 4. 执行路由跳转
    router.push({
      path: index // 跳转到对应路由路径
    }).catch(error => {
      // 捕获跳转异常（如路径不存在），避免控制台报错
      console.warn('菜单路由跳转失败：', error)
    })
  }
}
</script>

<style scoped lang='less'>
.logo {
  width: 100%;
  min-height: 50px;
  background-color: #2d3748;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
  }

  .title {
    margin-left: 5px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
  }
}

.text {
  width: 100%;
  color: #fff;

  div {
    min-height: 56px;
    text-align: left;
    margin-left: 50px;
    line-height: 56px;
  }
}

/* 保持原有 el-menu 样式不变 */
.el-menu-vertical-demo {
  border-right: none;
}
.iconfont{
  margin-right: 5px;
}
/deep/.el-menu {
  background-color: #304156;

  span {
    color: #fff;
  }
}

.titles {
  font-size: 14px;
  cursor: pointer;
}

.el-menu-item {
  color: #fff;
}

/deep/.el-sub-menu__title {
  color: #fff;
}
</style>