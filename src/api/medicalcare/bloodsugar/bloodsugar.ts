import http from "../../../utils/request";
import type {
  bloodSugarListParams,
  bloodSugarListResponse,
} from "./bloodsugarType";

/**
 * 获取血糖列表
 */
export const getBloodSugarList = (params: bloodSugarListParams) =>
  http.get<bloodSugarListResponse>("/bloodSugar/list", params);

/**
 * 删除血糖

 */
export const delBloodSugarById = (id: number) =>
  http.delete(`/bloodSugar/delete/${id}`);

/**
 * 批量删除
 */
export const delBloodSugarAllByIds = (data: number[]) =>
  http.post("/bloodSugar/deleteAll", data);
