import http from '../../utils/request';
import type { ItemList, MenuPermission, MenuPermissionList, PageData, roleData } from './roleType';

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

export const roleAdd = (data: MenuPermission) => http.post<PageData>('/api/role/add', data)

/**
 * 权限列表
 */
export const menuList = () => http.get<MenuPermissionList>('/api/menu/list')

/**
 * 获取单个角色信息
 */
export const roleGet = (id:number) => http.get<ItemList>(`/api/role/get/${id}`)






