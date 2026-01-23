import http from "../../../utils/request";
import type {
  purchaseParams,
  addPurchaseParams,
  purchasListResponse,
  addPurchaseResponse,
  purchaseGetResponse,
  PurchaseFoodsResponse,
  PurchaseCheckParams,
  PurchaseOrder,
} from "./purchaseType";

/**
 * 获取列表
 */
export const getPurchaseList = (params: purchaseParams) =>
  http.get<purchasListResponse>("/purchase/list", params);

/**
 * 删除
 */
export const delPurChase = (id: number) =>
  http.delete(`/purchase/delete/${id}`);

/**
 * 添加采购详情
 */
export const addPurchase = (data: addPurchaseParams) =>
  http.post<addPurchaseResponse>("/purchase/add", data);

/**
 * 根据id获取单条采购申请信息
 */
export const getPurchaseById = (id: number) =>
  http.get<purchaseGetResponse>(`/purchase/get/${id}`);

/**
 * 根据采购id获取采购物品
 */

export const getPurchaseFoods = (id: number) =>
  http.get<PurchaseFoodsResponse>(`/purchaseFoods/list/${id}`);

/**
 * 收货验收
 */
export const purchaseReceive = (params: PurchaseCheckParams) =>
  http.put<PurchaseOrder>("/purchase/check", params);
