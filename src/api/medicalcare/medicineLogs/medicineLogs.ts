import http from "../../../utils/request";
import type { drugsListParams, drugsListResponse } from "./medicineLogsType";

/**
 * 获取存药登记列表
 */

export const getDrugsList = (params: drugsListParams) =>
  http.get<drugsListResponse>("/drugs/list", params);
