import http from "../../../utils/request";
import type {
  bloodAddOrUpdateParams,
  bloodAddOrUpdateResponse,
  bloodItem,
  bloodListParams,
  bloodListResponse,
  buildingListResponse,
} from "./bloodType";

/**
 * 获取血压列表
 */
export const getBloodList = (params: bloodListParams) => http.get<bloodListResponse>("/bloodPressure/list", params);

/**
 * 获取楼栋列表
 */

export const getBuildingList = () => { return http.get<buildingListResponse>("/building/list");
};

/**
 * 删除
 */
export const delBloodById = (id: number) => { return http.delete(`bloodPressure/delete/${id}`);
};

//批量删除
export const deleteAllByIds = (data: number[]) => { return http.post("/bloodPressure/deleteAll", data);
};

/**
 * 获取单条血压详情
 */
export const getBloodById = (id: number) => {
  return http.get<bloodItem>(`/bloodPressure/get/${id}`);
};

/**
 * 添加血压
 */
export const addBlood = (data: bloodAddOrUpdateParams) => {
  return http.post<bloodAddOrUpdateResponse>("/bloodPressure/add", data);
};

/**
 * 修改血压
 */
export const updateBlood = (data: bloodAddOrUpdateParams) => {
  return http.put<bloodAddOrUpdateResponse>("/bloodPressure/update", data);
};
