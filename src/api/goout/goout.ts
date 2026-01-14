import http from "../../utils/request";
import type { ElderlyOutingItem, goOutType, OutingApplication, OutingApplyCore, OutingReturnRecord } from "./gooutType";

/**
 * 外出登记列表
 */
export const goOutList = (params: goOutType) => http.get<ElderlyOutingItem>("/api/goOut/list", params);

/**
 * 外出登记信息添加
 */
export const goOutadd = (data: OutingApplication) => http.post<ElderlyOutingItem>("/api/goOut/add", data);

/**
 * 外出返回信息添加 
 */
export const goBackadd = (data: OutingReturnRecord) => http.post<ElderlyOutingItem>("/api/goBack/add", data);

/**
 * 获取单条外出登记信息
 */
export const goOutGet = (id: number) => http.get(`/api/goOut/get/${id}`);

/**
 * 删除外出信息
 */
export const goOutDelete = (id: number) => http.delete(`/api/goOut/delete/${id}`);

/**
 * 外出登记信息修改
 */
export const goOutUpdate = (params: OutingApplyCore) => http.put<ElderlyOutingItem>("/api/goOut/update", params);