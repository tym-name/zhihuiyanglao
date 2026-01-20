import http from "../../../utils/request";
import type { purchaseParams, purchasListResponse } from "./purchaseType";

/**
 * 获取列表
 */
export const getPurchaseList = (params: purchaseParams) => http.get<purchasListResponse>("/purchase/list", params);

/**
 * 删除
 */
export const delPurChase = (id: number) => http.delete(`/api/purchase/delete/${id}`);