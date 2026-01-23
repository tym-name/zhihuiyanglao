import http from '../../utils/request';
import type { ServiceAddData, ServiceData, ServiceUpdateData } from './serviceType';

/**
 * 护理服务列表
 */
export const serviceList = (params: ServiceData) => http.get<any>("/nursingService/list", params);

/**
 * 删除护理服务
 */
export const serviceDelete = (id: number) => http.delete(`/nursingService/delete/${id}`);

/**
 * 护理服务添加
 */
export const serviceAdd = (data: ServiceAddData) => http.post<ServiceAddData>("/nursingService/add", data);

/**
 * 护理服务修改
 */
export const serviceUpdate = (data: ServiceUpdateData) => http.put<ServiceUpdateData>("/nursingService/update", data);