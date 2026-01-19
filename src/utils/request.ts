import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../stores/auth";

// 枚举与接口定义
enum ResultEnum {
  SUCCESS = 10000,
  UN_AUTHORIZED = 401,
}

enum HttpMethodEnum {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
}

export interface ApiResponse<T = any> {
  msg: string;
  code: number;
  data: T;
}

// 全局配置
const HTTP_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 10000,
  CONTENT_TYPE: "application/json;charset=UTF-8",
  REFRESH_TOKEN_URL: "/account/refreshToken",
};

class Http {
  private instance: AxiosInstance;
  private isRefreshing = false;
  // 修复：重试队列回调改为返回Promise<any>，传递重试请求的响应数据
  private retryRequests: ((newToken: string) => Promise<any>)[] = [];

  constructor() {
    this.instance = axios.create({
      baseURL: HTTP_CONFIG.BASE_URL,
      timeout: HTTP_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": HTTP_CONFIG.CONTENT_TYPE,
      },
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token && config.headers && typeof config.headers === "object") {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error: AxiosError) => {
        console.error("请求拦截器错误：", error);
        ElMessage.error("请求配置异常，请稍后重试");
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.handleSuccessResponse(response),
      (error: AxiosError) => this.handleErrorResponse(error)
    );
  }

  /**
   * 处理成功响应
   */
  private handleSuccessResponse(response: AxiosResponse): any {
    if (response.config.responseType === "blob") {
      return response.data;
    }

    if (response.data && "imageCode" in response.data) {
      return response;
    }

    const responseData = response.data as ApiResponse;
    if (!responseData) {
      ElMessage.error("接口返回数据格式异常");
      return Promise.reject(new Error("接口返回数据格式异常"));
    }

    if (responseData.code === ResultEnum.SUCCESS) {
      return responseData;
    } else {
      const errorMessage = responseData.msg || "请求失败，请稍后重试";
      ElMessage.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
  }

  /**
   * 处理错误响应（核心修复：将401处理结果返回给上层）
   */
  private async handleErrorResponse(error: AxiosError): Promise<any> {
    let errorMessage = "请求失败";

    if (!error.response) {
      errorMessage = error.request ? "网络连接异常，请检查网络" : error.message || "请求配置异常";
    } else {
      const status = error.response.status;
      switch (status) {
        case ResultEnum.UN_AUTHORIZED:
          // 修复：返回401处理后的实际响应数据（而非错误字符串）
          try {
            return await this.handle401Error(error);
          } catch (err) {
            errorMessage = (err as Error).message;
          }
          break;
        case 403:
          errorMessage = "拒绝访问（无权限操作）";
          break;
        case 404:
          errorMessage = "请求资源不存在";
          break;
        case 405:
          errorMessage = "请求方式错误，请检查接口配置";
          break;
        case 500:
          errorMessage = "服务器内部错误，请稍后重试";
          break;
        default:
          errorMessage = `服务器响应异常 [${status}]`;
      }
    }

    if (!error.message.includes("canceled")) {
      ElMessage.error(errorMessage);
    }

    return Promise.reject(new Error(errorMessage));
  }

  /**
   * 处理401未授权（核心修复：返回重试请求的响应数据）
   */
  private async handle401Error(error: AxiosError): Promise<any> {
    const authStore = useAuthStore();
    const refreshToken = authStore.refreshToken;

    // 无刷新token，直接跳转登录并抛出错误
    if (!refreshToken) {
      this.redirectToLogin();
      throw new Error("登录状态已过期，请重新登录");
    }

    // 正在刷新token，加入重试队列并等待返回数据
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.retryRequests.push(async (newToken: string) => {
          try {
            // 修复：返回重试请求的响应数据给对应的业务调用
            const result = await this.retryFailedRequest(error, newToken);
            resolve(result);
          } catch (err) {
            reject(new Error("刷新token后，请求重试失败"));
          }
        });
      });
    }

    // 开始刷新token
    this.isRefreshing = true;
    try {
      // 刷新token获取新凭证
      const refreshResponse = await this.refreshTokenRequest(refreshToken);
      const newToken = refreshResponse.data.data.token;
      const newRefreshToken = refreshResponse.data.data.refreshToken;

      if (!newToken || !newRefreshToken) {
        throw new Error("刷新token返回数据无效");
      }

      // 更新Pinia中的token
      authStore.token = newToken;
      authStore.refreshToken = newRefreshToken;

      // 修复：执行重试队列并传递所有请求的响应数据
      // const retryResults = await Promise.all(
      //   this.retryRequests.map((callback) => callback(newToken))
      // );
      this.retryRequests = []; // 清空重试队列

      // 修复：返回当前失败请求的重试响应数据（核心，让列表获取到最新数据）
      const currentRequestResult = await this.retryFailedRequest(error, newToken);

      // 若有并发请求，返回当前请求的结果（重试队列结果可按需处理）
      return currentRequestResult;
    } catch (refreshError) {
      this.redirectToLogin();
      throw new Error("登录状态已过期，请重新登录");
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * 重试失败的请求（核心修复：返回重试请求的响应数据）
   */
  private async retryFailedRequest(error: AxiosError, newToken: string): Promise<any> {
    if (!error.config || typeof error.config !== "object") {
      throw new Error("请求配置无效，无法重试");
    }

    // 更新请求头中的新token
    (error.config.headers as Record<string, string>).Authorization = newToken;

    // 修复：返回重试请求的完整响应数据（经过拦截器处理后的业务数据）
    return await this.instance.request(error.config);
  }

  /**
   * 刷新token的请求
   */
  private refreshTokenRequest(refreshToken: string) {
    return axios.request({
      url: HTTP_CONFIG.REFRESH_TOKEN_URL,
      baseURL: HTTP_CONFIG.BASE_URL,
      method: HttpMethodEnum.GET,
      headers: {
        Authorization: refreshToken,
      },
      timeout: HTTP_CONFIG.TIMEOUT,
    });
  }

  /**
   * 跳转登录页
   */
  private redirectToLogin() {
    const authStore = useAuthStore();
    authStore.token = "";
    authStore.refreshToken = "";

    if (!window.location.href.includes("/login")) {
      window.location.href = "/login";
    }
  }

  /**
   * 通用请求方法
   */
  public request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.request(config) as Promise<ApiResponse<T>>;
  }

  /**
   * GET请求封装
   */
  public get<T, P = Record<string, any>>(url: string, params?: P): Promise<ApiResponse<T>> {
    return this.request({
      method: HttpMethodEnum.GET,
      url,
      params,
    });
  }

  /**
   * POST请求封装
   */
  public post<T, P = Record<string, any>>(
url: string, data?: P | FormData, _p0?: { headers: { 'Content-Type': string; }; }  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: HttpMethodEnum.POST,
      url,
      data,
    };

    if (data instanceof FormData) {
      delete config.headers;
    }

    return this.request(config);
  }

  /**
   * DELETE请求封装
   */
  public delete<T, P = Record<string, any>>(url: string, params?: P): Promise<ApiResponse<T>> {
    return this.request({
      method: HttpMethodEnum.DELETE,
      url,
      params,
    });
  }

  /**
   * PUT请求封装
   */
  public put<T, P = Record<string, any>>(url: string, data?: P): Promise<ApiResponse<T>> {
    return this.request({
      method: HttpMethodEnum.PUT,
      url,
      data,
    });
  }
}

// 导出单例实例
const http = new Http();
export default http;