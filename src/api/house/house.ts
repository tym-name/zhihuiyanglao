import http from "../../utils/request";
import type { BuildingInfo, PageQueryParams, RoomInfo, RoomInfoList } from "./houseType";

/**
 * 房间管理列表
 */
export const houselist = (params: PageQueryParams) => http.get<RoomInfoList>("/house/list", params);

/**
 * 删除房间管理
 */

export const houseDelete=(id:number)=>http.delete(`/house/delete/${id}`);

/**
 * 批量删除房间管理
 */

export const houseDeleteAll=(id:number[])=>http.post(`/house/deleteAll`,id);

/**
 * 房型管理添加
 */
export const housetypeAdd=(data:BuildingInfo)=>http.post<RoomInfo>("/house/add",data);

/**
 * 房型管理修改
 */

export const housetypeUpdate=(data:BuildingInfo)=>http.put<RoomInfo>("/house/update",data);