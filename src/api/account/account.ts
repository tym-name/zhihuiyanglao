import http from '@/utils/request';
import type { AccountType, AccountData, role, accountAddData, AccountResult } from './accountType';

/**
 * 账号列表
 */
export const accountList = (params: AccountType) => http.get<AccountData>("/account/list", params);
/**
 * 删除账号
 */

export const deleteAccountList = ((id: number) => http.delete<AccountData>(`/account/delete/${id}`));

/**
 * 批量删除账号
 */
export const accountDeleteAll = ((ids: number[]) => http.post('/account/deleteAll', ids));

/**
 * 所属角色
 */
export const roleList = () => http.get<role>("/role/list");

/**
 * 添加账号
 */
export const accountAdd = (data: accountAddData) => http.post('/account/add', data);

/**
 * 获取单条账号信息
 */
export const accountGet = (id:number) => http.get<AccountResult>(`/account/get/${id}`);

/**
 * 修改账号
 */
export const accountUpdate = (data:accountAddData) => http.put('/account/update',data);