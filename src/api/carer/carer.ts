import http from '../../utils/request';
import type { roleListData, roleListFunList } from './carerType';

/**
  * 添加护工弹窗
*/
export const staffList = (params: roleListData) => http.get<roleListFunList>("/staff/list", params);
/**
  * 提交
*/
export const staffCarerAdd = (params: number[]) => http.post<roleListFunList>("/staff/careradd", params);