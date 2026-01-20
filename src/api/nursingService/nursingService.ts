import http from "../../utils/request";
import type { CareServiceItem, CareServiceResponse, NursingService, NursingType } from "./nursingServiceType";


/**
 * 护理服务列表
 */

export const nursingServiceList=(params:NursingType)=>http.get<CareServiceResponse>("/nursingService/list",params);

/**
 * 护理服务添加
 */

export const nursingServiceAdd=(data:NursingService)=>http.post<CareServiceItem>("/nursingService/add",data);

/**
 * 护理服务修改
 */

export const nursingServiceUpdate=(data:NursingService)=>http.put<CareServiceItem>("/nursingService/update",data);

/**
 * 删除护理服务
 */
export const nursingServiceDelete = (id: number) => http.delete(`/nursingService/delete/${id}`)

/**
 * 批量删除护理服务
 */
export const nursingServiceDeleteAll = (ids: number[]) => http.post('/nursingService/deleteAll', ids)

