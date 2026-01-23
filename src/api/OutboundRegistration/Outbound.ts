import request from "../../utils/request"
import type { ApifoxModel, PersonListResponse } from "./oldManList"
import type { ElderlyDetail } from "./ResidentDetail"
import type { ElderlyOutRecordPageResponse, ElderlyOutRecordParams } from "./type"

/**
 * 获取老人外出记录列表参数接口
 */
export const getElderlyList = async (params: any) => {
  return request.get<ElderlyOutRecordPageResponse>('/goOut/list', { params })
}

/**
 * 删除外出信息接口
 */

export const getDel1 = (id: number) => {  // 删除外出信息接口
  return request.delete<any>(`/goOut/delete/${id}`);
}


/**
 * 批量删除外出信息接口
 * */
export const getAllDel = (data: number[]) => {
  return request.post("/goOut/deleteAll", data)
}


/**
 *   添加外出信息接口
 * @param data 
 * @returns 
 */

export const getAdd = (data: ElderlyOutRecordParams) => {
  return request.post("/goOut/add", data)
}


/**
 * 修改外出信息接口
 */
export const getUpdate = (data: ElderlyOutRecordParams) => {
  return request.put("/goOut/update", data)
}

/**
 * 老人列表接口
 * @param params 
 * @returns 
 */
export const getOldManList = (params: ApifoxModel) => {
  return request.get<PersonListResponse>('/elderly/list', { params })
}

/** 老人详情接口 */
export const getOldManDetail = (id: number) => {
  return request.get<ElderlyDetail>(`/elderly/get/${id}`)
}

/** 获取单条外出登记信息 */
export const goOutGetElderly = (id: number) => {
  return request.get<ElderlyDetail>(`/elderly/get/${id}`)
}



