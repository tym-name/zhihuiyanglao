import http from "../../utils/request";
import type { ElderlyCostInfo, ElderlyOrderInfo, orderData } from "./HospitalizedType";


/**
 * 入院列表
 */

export const orderList = (params: orderData) => http.get<any>("/order/list", params);

/**
 * 获取单条入院信息
 */

export const orderGet = (id: number) => http.get(`/order/get/${id}`);

/**
 * 删除入院信息
 */

export const orderDelete = (id: number) => http.delete(`/order/delete/${id}`);

/**
 * 入院添加
 */

export const orderAdd = (data: ElderlyCostInfo) => http.post<ElderlyCostInfo>("/order/add", data);

/**
 * 入院信息修改
 */

export const orderUpdate = (data: ElderlyOrderInfo) => http.put<ElderlyOrderInfo>("/order/update", data);
