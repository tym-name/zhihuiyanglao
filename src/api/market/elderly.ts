import http from "../../utils/request";
import type { ElderlyInfos, ElderlyInfoAdd, ElderlyType, PersonListResponse, IllnessListResponse, PersonInfo, BuildingType, BuildingResponse, FormListResponse, FileItemDetail, nursingService, CompanyDataList, CycleTaskData, CycleTask } from "./elderlyType";


/**
 * 老人列表
 */

export const getCaptcha=(params:ElderlyType)=>http.get<PersonListResponse>("/elderly/list",params);

/**
 * 老人添加
 */

export const ElderlyAdd=(data:ElderlyInfoAdd)=>http.post<ElderlyInfos>("/elderly/add",data);

/**
 * 所有疾病类目
 */

export const DiseaseList=()=>http.get<IllnessListResponse>("/disease/list");

/**
 * 所有自理类目
 */

export const SelfcareList=()=>http.get<IllnessListResponse>("/selfcare/list");

/**
 * 所有体检类目
 */

export const CheckupitemsList=()=>http.get<IllnessListResponse>("/checkupitems/list");

/**
 * 删除老人
 */

export const elderlyDelete=(id:number)=>http.delete(`/elderly/delete/${id}`);

/**
 * 批量删除老人
 */

export const elderlyDeleteAll=(id:number[])=>http.post(`/elderly/deleteAll`,id);

/**
 * 老人修改
 */

export const ElderlyUpdate=(_p0: number, data: ElderlyInfoAdd)=>http.put<ElderlyInfos>("/elderly/update",data);


/**
 * 获取单条老人
 */
export const elderlyGet = (id: number) => http.get<PersonInfo>(`/elderly/get/${id}`)

/**
 * 床位列表
 */

export const buildingList=(params: BuildingType)=>http.get<BuildingResponse>("/building/list",params);

/**
 * 档案管理列表
 */

export const fileitemsList=()=>http.get<FormListResponse>("/fileitems/list");

/**
 * 档案管理添加
 */

export const elderlyFilesAdd=(data:FileItemDetail)=>http.post<FormListResponse>("/elderlyFiles/add",data);

/**
 * 任务列表
 */

export const nursingServiceList=(params:nursingService)=>http.get<CompanyDataList>("/nursingService/list",params);

/**
 * 任务添加
 */

export const elderlyTaskAdd=(data:CycleTask)=>http.post<CycleTaskData>("/elderlyTask/add",data);

/**
 * 任务删除
 */

export const elderlyTaskDelete=(id:number)=>http.delete(`/elderlyTask/delete/${id}`);

/**
 * 任务删除
 */

export const elderlyTaskGetTask=(id:number)=>http.get<any>(`/elderlyTask/getTask/${id}`);
