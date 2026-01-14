import http from '../utils/request';
import type { PageData, roleData, RoleListData } from './roleList';

/**
 * 角色列表
 */
export const roleList = (params: roleData) => http.get<PageData>("/api/role/list", params);

/**
 * 删除角色
 */
export const roleDelete = (id: number) => http.delete<PageData>(`/api/role/delete/${id}`, );

/**
 * 批量删除角色
 */
export const roleDeleteAll = (ids: number[]) => http.post('/api/role/deleteAll', ids)

/**
 * 添加角色
 */

export const roleAdd = (data: any) => http.post<PageData>('/api/role/add', data)

/**
 * 获取所有权限列表
 */
export const menuList = () => http.get<RoleListData>("/api/menu/list");

/**
 * 根据id获取供应商信息
 */
export const supplierGet = (id: number) => http.get(`/api/supplier/get/${id}`, );
