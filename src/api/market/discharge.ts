import http from "../../utils/request";
import type { dischargeData, dischargeList } from "./dischargeType";

/**
 * 出院管理
 */

export const dischargeListFunc = (params: dischargeList) => http.get<dischargeData>("/discharge/list", params);
/**
 * 单删
 */
export const dischargeDelete = (id: number) => http.delete<dischargeData>(`/discharge/delete/${id}`);
/**
 * 批量删除
 */
export const dischargeDeleteAll = (ids: number[]) => http.post<dischargeData>(`/discharge/deleteAll`, ids);
/**
 * 编辑
 */

export const dischargeUpdate = (params: dischargeList) => http.put<dischargeData>('/discharge/update', params);
// 添加
export const dischargeAdd = (params: dischargeList) => http.post<dischargeData>('/discharge/add', params);