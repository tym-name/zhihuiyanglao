import http from "../../utils/request";
import type { resetPwdType } from "../account/accountType";
import type {  departmentData, departmentList } from "./personelType";

/**
 * 部门管理
 */
export const departmentListFun = (params: departmentList) => http.get<departmentData>("/department/list", params);
/**
 * 新增
 */
export const departmentAdd = (params: departmentList) => http.post("/department/add", params);
/**
 * 编辑
 */
export const departmentUpdate = (params: departmentList) => http.put("/department/update", params);
/**
 * 删除
 */
export const departmentDelete = (id: number) => http.delete(`/department/delete/${id}`);

/**
 * 批量删除
 */
export const departmentDeleteAll = (ids: number[]) => http.post('/staff/deleteAll', ids);
// 取消、禁用
export const accountUpdateEnable = () => http.put("/account/updateEnable");
// 重置密码
export const accountResetPwd = (params: resetPwdType) => http.get("/auth/publicKey", params);
