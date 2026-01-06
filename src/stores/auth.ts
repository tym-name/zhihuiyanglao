import { getPublicKey, login, menu } from '../api/index'
import { defineStore } from 'pinia'
import { sm2 } from 'sm-crypto'
import { ref } from 'vue'
import type { LoginPayload, MenuItem } from '../api/index/indexType'
import type { ApiResponse } from '../utile/request'
import { flatToTree } from '../utile/treeUtil'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')
  const permission = ref<MenuItem[]>([])
  const meuns = ref<MenuItem[]>([])
  
  //登录 
  const userLogin = async (data: LoginPayload) => {

    let publicKey: ApiResponse<string> = await getPublicKey(); //调接口获取公钥

    data.pwd = sm2.doEncrypt(data.pwd, publicKey.data); //加密

    const res = await login(data).catch(() => undefined);

    if (!res) return;

    token.value = res.data.token;

    return res;
  }
  //动态路由 
  const getMenu = async () => {
    if (permission.value.length == 0) {
      const res = await menu();
      permission.value = flatToTree(res.data.list);
      meuns.value = flatToTree(res.data.list.filter((item: { isButton: number }) => item.isButton == 0));
    }

    return permission.value
  }
  return {
    token,meuns,userLogin,getMenu,
  }
}, {
 persist:true
})
