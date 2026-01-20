import http from '../../utils/request';
import type { getListForUserData, getListForUserList, roleData, roleList, roleAddData } from './positionType';

/**
 * 岗位管理
 */
export const roleListFun = (params: roleList) => http.get<roleData>("/role/list", params);
/**
 * 删除
 */
export const roleDelete = (id: number) => http.delete<roleData>(`/role/delete/${id}`);

/**
 * 批量删除
 */
export const roleDeleteAll = (ids: number[]) => http.post<roleData>('/role/deleteAll', ids);
/**
 * 添加
 */
export const roleAdd = (params: roleAddData) => http.post<roleData>('/role/add', params);
/**
 * 权限配置
 */
export const menuGetListForUser = (params: getListForUserList) => http.get<getListForUserData>("/menu/getListForUser", params);