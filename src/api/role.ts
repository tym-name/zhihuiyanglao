import http from '../utile/request';
import type { PageData, roleData } from './roleList';

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


