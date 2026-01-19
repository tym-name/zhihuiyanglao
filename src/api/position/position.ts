import http from '../../utils/request';
import type { getListForUserData, getListForUserList, roleData, roleList, roleAddData } from './positionType';

/**
 * 岗位管理
 */
export const roleListFun = (params: roleList) => http.get<roleData>("/api/role/list", params);
/**
 * 删除
 */
export const roleDelete = (id: number) => http.delete<roleData>(`/api/role/delete/${id}`);

/**
 * 批量删除
 */
export const roleDeleteAll = (ids: number[]) => http.post<roleData>('/api/role/deleteAll', ids);
/**
 * 添加
 */
export const roleAdd = (params: roleAddData) => http.post<roleData>('/api/role/add', params);
/**
 * 权限配置
 */
export const menuGetListForUser = (params: getListForUserList) => http.get<getListForUserData>("/api/menu/getListForUser", params);