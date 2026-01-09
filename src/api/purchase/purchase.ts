import http from '../../utils/request';
import type { purchaseData, purchaseParams } from './purchaseType';

/**
 * 采购列表
 */
export const purchaseList = (params: purchaseParams) => http.get<purchaseData>("/api/purchase/list", params);