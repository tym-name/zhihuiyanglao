import type { MedicationRecord } from "../medicalcare/medicineLogs/medicineLogsType";
import type { elderlyParams } from "./type";
import request from "../../utils/request";

/**
 * 老人列表
 */
export const getElderlyList = (params: elderlyParams) => {
  return request.get<MedicationRecord>(`elderly/list`, { params });
};
