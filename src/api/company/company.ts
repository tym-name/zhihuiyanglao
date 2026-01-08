import http from '../../utile/request';
import type { CompanyInfo, HomeType, InstitutionItem, InstitutionListResponse, ResetPasswordParams } from '../company/companyType';

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
 * 重置密码
 */
export const resetPassword = (data: ResetPasswordParams)=> http.post<string>('/api/account/reset-password', data)

/**
 * 添加机构/修改机构
 */
export const companyAdd = (data: CompanyInfo)=> http.post<InstitutionListResponse>('/api/company/add', data)

/**
 * 获取单条机构信息
 */

export const companyGet = (id: number)=> http.get<InstitutionItem>(`/api/company/get/${id}`)
