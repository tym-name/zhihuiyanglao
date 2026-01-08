import http from '../../utile/request';
import type { RuleForm, supplier, SupplierInfo, SupplierPageResult } from './SupplierType';

/**
 * 供应商列表
 */

export const supplierList = (params: supplier) => http.get<SupplierPageResult>("/api/supplier/list", params);

/**
 * 删除供应商
 */
export const supplierDelete = (id: number) => http.delete(`/api/supplier/delete/${id}`)

/**
 * 批量删供应商
 */
export const supplierDeleteAll = (ids: number[]) => http.post('/api/supplier/deleteAll', ids)

/**
 * 添加供应商
 */

export const supplierAdd = (data: SupplierInfo) => http.post<SupplierInfo>("/api/supplier/add", data);

/**
 * 根据id获取供应商信息
 */
export const supplierGet = (id: number) => http.get(`/api/supplier/get/${id}`);

/**
 * 修改供应商
 */
export const supplierUpdate = (data: SupplierInfo) => http.put<SupplierInfo>("/api/supplier/update", data);
