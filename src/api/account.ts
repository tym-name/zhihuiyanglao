import http from '../utile/request';
import type { AccountType, AccountData,role } from './accountType';

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
// 
/**
 * 所属角色
 */

export const roleList = () => http.get<role>("/api/role/list");

