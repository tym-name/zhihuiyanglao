import http from "../../utils/request";
import type { customerParams, ElderlyInfo, ElderlyInfoAdd } from "./customerType";



/**
 * 潜在客户列表
 */

export const customerList =(params:customerParams)=>http.get<any>("/customer/list",params);

/**
 * 删除潜在客户
 */

export const customerDelete =(id:number)=>http.delete(`/customer/delete/${id}`);

/**
 * 获取单条客户信息
 */

export const customerGet =(id:number)=>http.get<any>(`/customer/get/${id}`);

/**
 * 潜在客户添加
 */

export const customerAdd =(data:ElderlyInfoAdd)=>http.post<ElderlyInfoAdd>("/customer/add",data);

/**
 * 潜在客户修改
 */

export const customerUpdate =(data:ElderlyInfo)=>http.put<ElderlyInfo>("/customer/update",data);
