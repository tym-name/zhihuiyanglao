import http from "../../utils/request";
import type { ElderlyInfos, ElderlyInfoAdd, ElderlyType, PersonListResponse, IllnessListResponse, PersonInfo } from "./elderlyType";


/**
 * 老人列表
 */

export const getCaptcha=(params:ElderlyType)=>http.get<PersonListResponse>("/api/elderly/list",params);

/**
 * 老人添加
 */

export const ElderlyAdd=(data:ElderlyInfoAdd)=>http.post<ElderlyInfos>("/api/elderly/add",data);

/**
 * 所有疾病类目
 */

export const DiseaseList=()=>http.get<IllnessListResponse>("/api/disease/list");

/**
 * 所有自理类目
 */

export const SelfcareList=()=>http.get<IllnessListResponse>("/api/selfcare/list");

/**
 * 所有体检类目
 */

export const CheckupitemsList=()=>http.get<IllnessListResponse>("/api/checkupitems/list");

/**
 * 删除老人
 */

export const elderlyDelete=(id:number)=>http.delete(`/api/elderly/delete/${id}`);

/**
 * 批量删除老人
 */

export const elderlyDeleteAll=(id:number[])=>http.post(`/api/elderly/deleteAll`,id);

/**
 * 老人修改
 */

export const ElderlyUpdate=(_p0: number, data: ElderlyInfoAdd)=>http.put<ElderlyInfos>("/api/elderly/update",data);


/**
 * 获取单条老人
 */
export const elderlyGet = (id: number) => http.get<PersonInfo>(`/api/elderly/get/${id}`)
