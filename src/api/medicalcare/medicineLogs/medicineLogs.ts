// import request from "../../utils/request";
// import type { MedicationDeliveryRecord } from "./MedicineLogsType";
import request from "../../../utils/request";
import type {
  AddMedicineLogsParams,
  DrugAddParams,
  MedicationInfo,
  MedicationRecord,
  MedicineLogsList,
  MedicineLogsParams,
  MedicinePlansetResponse,
  MedicineResponse,
  Plan,
} from "./medicineLogsType";

// /**
//  * 用药登记列表
//  * @param params
//  * @returns
//  */
// export const getNedList = (params:MedicationDeliveryRecord)=>{
//     return request.get("drugs/list",{params})
// }

/**
 * 获取用药登记列表
 */
export const getMedicineLogs = (params: MedicineLogsParams) => {
  return request.get<MedicineLogsList>("drugs/list", { params });
};

/**
 * 存药登记添加（旧版本，保留兼容性）
 */
export const addMedicineLogs = (data: AddMedicineLogsParams) => {
  return request.post<string>("drugs/add", data);
};

/**
 * 用药登记添加单个药品
 */
export const addDrug = (data: DrugAddParams) => {
  return request.post<string>("drugs/add", data);
};

/**
 * 存药登记详情
 */
export const medicineLogsDetail = (id: number) => {
  return request.get<MedicationRecord>(`drugs/get/${id}`);
};

/**
 * 存药登记删除

 */
export const deleteMedicineLogs = (id: number) => {
  return request.delete<string>(`drugs/delete/${id}`);
};

/**
 * 批量删除drugs/deleteAll
 */
export const deleteMedicineLogsAll = (ids: number[]) => {
  return request.post(`drugs/deleteAll`, ids);
};

/**
 * 获取老人的存药记录
 */
export const getElderlyMedicineLogs = (elderlyId: number) => {
  return request.get<MedicineResponse>(`drugs/listForElderly/${elderlyId}`);
};

/**
 * 存药登记的修改
 */
export const updateMedicineLogs = (data: AddMedicineLogsParams) => {
  return request.put<string>(`drugs/update`, data);
};

/**
 * 根据id获取用药的计划列表
 */
export const getMedicineLogsById = (id: number) => {
  return request.get<MedicinePlansetResponse>(`drugs/listForPlan/${id}`);
};

/**
 * 用药计划的添加
 */
export const addMedicineLogsPlan = (data: MedicationInfo) => {
  return request.post<string>(`drugPlan/add`, data);
};

/**
 * 用停止用药
 */
export const stopMedicineLogs = (data: Plan) => {
  return request.put<string>(`drugPlan/updateEndDate/`, data);
};
