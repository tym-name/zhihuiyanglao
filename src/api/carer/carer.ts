// import http from '../../utils/request';
// import type { AccountType, AccountData, role, accountAddData, AccountResult } from './accountType';

// /**
//  * 账号列表
//  */
// export const accountList = (params: AccountType) => http.get<AccountData>("/api/account/list", params);
// /**
//  * 删除账号
//  */

// export const deleteAccountList = ((id: number) => http.delete<AccountData>(`/api/account/delete/${id}`));

// /**
//  * 批量删除账号
//  */
// export const accountDeleteAll = ((ids: number[]) => http.post('/api/account/deleteAll', ids));

// /**
//  * 所属角色
//  */
// export const roleList = () => http.get<role>("/api/role/list");

// /**
//  * 添加账号
//  */
// export const accountAdd = (data: accountAddData) => http.post('/api/account/add', data);

// /**
//  * 获取单条账号信息
//  */
// export const accountGet = (id:number) => http.get<AccountResult>(`/api/account/get/${id}`);

// /**
//  * 修改账号
//  */
// export const accountUpdate = (data:accountAddData) => http.put('/api/account/update',data);