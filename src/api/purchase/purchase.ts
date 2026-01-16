import http from '../../utils/request';
import type { purchaseData, purchaseParam, purchaseParams } from './purchaseType';

/**
 * 采购列表
 */
export const purchaseList = (params: purchaseParams) => http.get<purchaseData>("/api/purchase/list", params);
/**
 * 根据id获取单条采购列表
 */
export const purchaseGet = (params: { id: number }) => http.get<purchaseParam>(`/api/purchase/get/${params.id}`);
/**
 * 根据采购id获取采购物品列表
 */
export const purchaseFoodsList = (params: { id: number }) => http.get<purchaseData>(`/api/purchaseFoods/list/${params.id}`);
