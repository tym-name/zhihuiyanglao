import http from "../../utils/request";
import type { AddressType, EntityItem, EntityPageResponse, EntityResponse } from "./addressType";

/**
 * 地址列表
 */
export const addressList = (params:AddressType ) => http.get<EntityPageResponse>("/address/list", params);

/**
 * 地址删除
 */
export const addressDelete = (id:number) => http.delete(`/address/delete/${id}`);

/**
 * 批量删除地址
 */
export const addressDeleteAll = (ids: number[]) => http.post('/address/deleteAll', ids)

/**
 * 添加地址
 */
export const addressAdd = (data: EntityResponse) => http.post<EntityItem>('/address/add', data)

/**
 * 修改地址
 */
export const addressUpdate = (data: EntityResponse) => http.put<EntityItem>('/address/update', data)