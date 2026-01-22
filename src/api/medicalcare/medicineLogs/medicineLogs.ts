import http from "../../../utils/request";
import type { drugsListParams, drugsListResponse } from "./medicineLogsType";

/**
 * 获取存药登记列表
 */

export const getDrugsList = (params: drugsListParams) =>
  http.get<drugsListResponse>("/drugs/list", params);

/**
 * 批量删除
 */
export const delDrugsAllByIds = (data: number[]) =>
  http.post("/drugs/deleteAll", data);
