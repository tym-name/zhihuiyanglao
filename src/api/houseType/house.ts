import http from "../../utils/request";
import type { House, HouseList, HouseListResult, HouseType } from "./houseType";


/**
 * 房型管理列表
 */

export const housetypeList=(data:HouseType)=>http.get<HouseListResult>("/housetype/list",data);

/**
 * 删除房型管理
 */

export const housetypeDelete=(id:number)=>http.delete(`/housetype/delete/${id}`);

/**
 * 批量删除房型管理
 */

export const housetypeDeleteAll=(id:number[])=>http.post(`/housetype/deleteAll`,id);

/**
 * 房型管理添加
 */

export const housetypeAdd=(data:House)=>http.post<HouseList>("/housetype/add",data);

/**
 * 房型管理修改
 */

export const housetypeUpdate=(data:House)=>http.put<HouseList>("/housetype/update",data);