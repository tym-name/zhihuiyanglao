import http from '../../utils/request';
import type { staffList, staffData, staffUpdateData } from './staffType';


/**
 * 员工管理
 */
export const staffListFun = (params: staffList) => http.get<staffData>("/api/staff/list", params);
/**
 * 单删
 */
export const staffDelete = (id: number) => http.delete(`/api/staff/delete/${id}`);
/**
 * 批量删除
 */
export const staffDeleteAll = (ids: number[]) => http.post('/api/staff/deleteAll', ids);
/**
 * 编辑
 */
export const staffUpdate = (params: staffUpdateData) => http.put("/api/staff/update", params);
// 详情
export const staffGet = (id: number) => http.get<staffUpdateData>(`/api/staff/get/${id}`);