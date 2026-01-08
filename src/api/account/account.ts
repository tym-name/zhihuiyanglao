import http from '../../utils/request';
import type { AccountType, AccountData, role, accountAddData, uploadAddData, uploadAddResult, resetPwdType } from './accountType';

/**
 * 账号列表
 */
export const accountList = (params: AccountType) => http.get<AccountData>("/api/account/list", params);

/**
 * 删除账号
 */

export const deleteAccountList = ((id: number) => http.delete<AccountData>(`/api/account/delete/${id}`));

/**
 * 批量删除账号
 */
export const accountDeleteAll = ((ids: number[]) => http.post('/api/account/deleteAll', ids));

/**
 * 所属角色
 */
export const roleList = () => http.get<role>("/api/role/list");

/**
 * 添加账号
 */
export const accountAdd = ((params: accountAddData) => http.post('/api/account/add', params));

/**
 * 添加账号头像
 */
export const uploadAdd = (() => http.post<uploadAddResult>('/api/upload/add',));

/**
 * 重置密码
 */
export const accountResetPwd = (params: resetPwdType) => http.put("/api/account/resetPwd", params);