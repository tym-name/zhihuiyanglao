import http from "../../../utils/request";
import type {
  addOUpdateBloodSugarParams,
  addOUpdateBloodSugarResponse,
  bloodSugarListItem,
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

/**
 * 添加血糖
 */
export const addBloodSugar = (data: addOUpdateBloodSugarParams) =>
  http.post<addOUpdateBloodSugarResponse>("/bloodSugar/add", data);

/**
 * 修改血糖
 */
export const updateBloodSugar = (data: addOUpdateBloodSugarParams) =>
  http.put<addOUpdateBloodSugarResponse>("/bloodSugar/update", data);

/**
 * 获取血糖详情

 */
export const getBloodSugarById = (id: number) =>
  http.get<bloodSugarListItem>(`/bloodSugar/get/${id}`);
