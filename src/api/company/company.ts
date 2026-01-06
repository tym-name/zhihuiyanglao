import http from '../../utile/request';
import type { HomeType, InstitutionListResponse } from '../company/companyType';

/**
 * 机构列表
 */

export const companyList = (params: HomeType) => http.get<InstitutionListResponse>("/api/company/list", params);

/**
 * 删除机构列表
 */
export const deleteAccount = (id: number) => http.delete(`/api/company/delete/${id}`)

/**
 * 批量删除机构列表
 */
export const companyDeleteAll = (ids: number[]) => http.post('/api/company/deleteAll',ids)

/**
 * 添加机构
 */
export const addCompany=(params:HomeType)=>http.get<InstitutionListResponse>("/api/company/list",params);
