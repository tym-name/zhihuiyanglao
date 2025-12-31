import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { useAuthStore } from '../stores/auth'

enum ResultEnum{
    SUCCESS=10000
}

export interface  ApiResponse<T>{
    code: number,
    msg: string,
    data:T
}

class Http{
    private  instance:  AxiosInstance;
    private readonly BaseUrl: string;
    
    constructor(){
        this.BaseUrl=import.meta.env.VITE_API_BASE_URL;

        //创建一个axios实例
        this.instance=axios.create({
            baseURL:this.BaseUrl,
            timeout:5000,
        });

        //请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                // 添加全局的请求拦截器
                // 添加token
                const authStore = useAuthStore()

                const token = authStore.token;
                if (token) {
                    // config.headers.Authorization = `Bearer ${token}`;
                    config.headers.Authorization = token;
                }
                return config;
            },
            (error) => {
                // 错误处理
                console.log("请求拦截器错误",error);
                
            }
        )
        //响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // 处理二进制响应 (文件下载等)
                if (response.config.responseType === "blob") {

                    return response.data;

                }

                //特殊处理
                if(response.data.imageCode){
                    return response;
                }

                if(response.data.code === ResultEnum.SUCCESS){

                    return response.data;

                }
                else{
                    let errorMessage=response.data.msg || "请求失败";
                    ElMessage.error(errorMessage) //提示用户
                    return Promise.reject(new Error(errorMessage))
                }

              //  return response.data;
               // console.log("请求返回的数据",response.data);
                
 
            },(error) => { 

                console.log("请求错误",error);

                this.handleError(error);
                
            }
        )
        

    }
    private handleError(error:any) {

        let errorMessage:string = '请求失败';
        if(error.response){

            switch (error.response.status) {
                case 401:
                  errorMessage = '未授权，请重新登录'
                  break
                case 403:
                  errorMessage = '拒绝访问'
                  break
                  case 405:
                    errorMessage = '请求方式错误'
                    break
                case 404:
                  errorMessage = '请求资源不存在'
                  break
                case 500:
                  errorMessage = '服务器错误'
                  break
                default:
                  errorMessage = `服务器响应异常 [${error.response.status}]`
              }
        }
         else if(error.request){
            errorMessage = '网络连接异常，请检查网络'
        }
        else {
            // 请求配置问题
            errorMessage = error.message
          }

          ElMessage.error(errorMessage) //提示用户

          return Promise.reject(new Error(errorMessage))

        // 错误处理逻辑
   
    }


    public request<T>(config:AxiosRequestConfig):Promise<ApiResponse<T>>{ 

        return this.instance.request(config);

    }
    public get<T,P=Object>(url:string,params?:P):Promise<ApiResponse<T>>{ 

         
        return this.request({ method: 'GET', url, params})

    }
    public post<T,P=Object>(url:string,data?:P):Promise<ApiResponse<T>>{
        return this.request({ method: 'POST', url, data})
    }
    public delete<T,P=Object>(url:string,params?:P):Promise<ApiResponse<T>>{ 

        return this.request({ method: 'DELETE', url, params})

    }
    public put<T,P=Object>(url:string,data?:P):Promise<ApiResponse<T>>{
        return this.request({ method: 'PUT', url, data})
    }
    

}

const http=new Http();  
export default http;