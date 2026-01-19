import http from "../../../utils/request";
import type {
  bloodListParams,
  bloodListResponse,
  buildingListResponse,
} from "./bloodType";

/**
 * 获取血压列表
 */
export const getBloodList = (params: bloodListParams) =>
  http.get<bloodListResponse>("/bloodPressure/list", params);

/**
 * 获取楼栋列表
 */

export const getBuildingList = () => {
  return http.get<buildingListResponse>("/building/list");
};

/**
 * 删除
 */
export const delBloodById = (id: number) => {
  return http.delete(`bloodPressure/delete/${id}`);
};

//批量删除
export const deleteAllByIds = (data: number[]) => {
  return http.post("/bloodPressure/deleteAll", data);
};
