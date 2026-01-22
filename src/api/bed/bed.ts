import http from "../../utils/request";
import type { BedInfo, bedsListType, HouseAccountInfo, HouseAccountList } from "./bedType";


/**
 * 床位列表
 */

export const bedsList=(params:bedsListType)=>http.get<HouseAccountList>("/beds/list",params);

/**
 * 床位添加
 */

export const bedsAdd=(data:BedInfo)=>http.post<HouseAccountInfo>("/beds/add",data);

/**
 * 床位修改
 */

export const bedsUpdate=(data:BedInfo)=>http.put<HouseAccountInfo>("/beds/update",data);

/**
 * 删除床位
 */
export const bedsDelete = (id: number) => http.delete(`/beds/delete/${id}`);

/**
 * 批量删除床位
 */
export const bedsDeleteAll = (ids: number[]) => http.post('/beds/deleteAll', ids)