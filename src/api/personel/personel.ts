import http from "../../utils/request";
import type { resetPwdType } from "../account/accountType";
import type {  departmentData, departmentList } from "./personelType";

/**
 * 部门管理
 */
export const departmentListFun = (params: departmentList) => http.get<departmentData>("/api/department/list", params);
/**
 * 新增
 */
export const departmentAdd = (params: departmentList) => http.post("/api/department/add", params);
/**
 * 编辑
 */
export const departmentUpdate = (params: departmentList) => http.put("/api/department/update", params);
/**
 * 删除
 */
export const departmentDelete = (id: number) => http.delete(`/api/staff/delete/${id}`);

/**
 * 删除
 */
export const departmentDeleteAll = (ids: number[]) => http.post('/api/staff/deleteAll', ids);
// 取消、禁用
export const accountUpdateEnable = () => http.put("/api/account/updateEnable");
// 重置密码
export const accountResetPwd = (params: resetPwdType) => http.get("/api/auth/publicKey", params);
