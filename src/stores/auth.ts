import { getPublicKey, login } from '../api/index'
import { defineStore } from 'pinia'
import { sm2 } from 'sm-crypto'
import { ref } from 'vue'
import type { LoginPayload } from '../api/indexType'
import type { ApiResponse } from '../utile/request'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')

  //登录 
  const userLogin = async (data: LoginPayload) => {

    let publicKey: ApiResponse<string> = await getPublicKey(); //调接口获取公钥

    data.pwd = sm2.doEncrypt(data.pwd, publicKey.data); //加密

    const res = await login(data).catch(() => undefined);

    if (!res) return;

    token.value = res.data.token;

    return res;


  }
  return {
    token, userLogin
  }
}, {
  persist: true
})