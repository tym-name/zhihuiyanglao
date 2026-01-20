import { getPublicKey, login, menu } from "../api/index";
import { defineStore } from "pinia";
import { sm2 } from "sm-crypto";
import { ref } from "vue";
import type { LoginPayload, MenuItem } from "../api/index/indexType";
import type { ApiResponse } from "../utils/request";
import { flatToTree } from "../utils/treeUtil";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string>("");
    const permission = ref<MenuItem[]>([]);
    const meuns = ref<MenuItem[]>([]);
    //刷新token
    const refreshToken = ref<string>("");
    //登录接口返回的model数据
    const model = ref<any>({});
    //登录
    const userLogin = async (data: LoginPayload) => {
      try {
        // 登录前清除旧的 token，避免携带过期 token 导致 403
        token.value = "";
        refreshToken.value = "";

        let publicKey: ApiResponse<string> = await getPublicKey(); //调接口获取公钥

        data.pwd = sm2.doEncrypt(data.pwd, publicKey.data); //加密

        const res = await login(data).catch(() => undefined);
        
        if (!res) return;
        token.value = res.data.token;
        refreshToken.value = res.data.refreshToken;
        
        // 保存登录接口返回的model数据
        if (res.data.model) {
          model.value = res.data.model;
        }

        return res;
      } catch (error) {
        console.error("登录失败:", error);
        return undefined;
      }
    };
    //动态路由
    const getMenu = async () => {
      if (permission.value.length == 0) {
        const res = await menu();
        if (res.code == 10000) {
          permission.value = flatToTree(res.data.list);
          meuns.value = flatToTree(
            res.data.list.filter(
              (item: { isButton: number }) => item.isButton == 0
            )
          );
        }
      }

      return permission.value;
    };
    return {
      token,
      meuns,
      userLogin,
      getMenu,
      refreshToken,
      model
    };
  },
  {
    persist: true,
  }
);
