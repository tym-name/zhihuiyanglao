import http from "../../utils/request";
import type { ElderlyOutingItem, GoOutInfo, goOutType, OutingApplyCore, OutingReturnRecord } from "./gooutType";

/**
 * 外出登记列表
 */
export const goOutlist = (params: goOutType) => http.get<ElderlyOutingItem>("/goOut/list", params);

/**
 * 外出登记信息添加
 */
export const goOutGetElderly = (data: GoOutInfo) => http.post<ElderlyOutingItem>("/goOut/add", data);

/**
 * 外出返回信息添加 
 */
export const goBackadd = (data: OutingReturnRecord) => http.post<ElderlyOutingItem>("/goBack/add", data);

/**
 * 获取单条外出登记信息
 */
export const goOutGet = (id: number) => http.get(`/goOut/get/${id}`);

/**
 * 删除外出信息
 */
export const goOutDelete = (id: number) => http.delete(`/goOut/delete/${id}`);

/**
 * 外出登记信息修改
 */
export const goOutUpdate = (data: OutingApplyCore) => http.put<ElderlyOutingItem>("/goOut/update", data);
