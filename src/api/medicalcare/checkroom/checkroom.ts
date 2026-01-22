import http from "../../../utils/request";
import type {
  AddOrUpdateCheckRoomParams,
  AddOrUpdateCheckRoomResponse,
  checkRoomListItem,
  checkRoomListParams,
  checkRoomListResponse,
} from "./checkroomType";

/**
 * 查房记录列表
 */

export const getCheckroomList = (params: checkRoomListParams) =>
  http.get<checkRoomListResponse>("/checkRoom/list", params);

/**
 * 删除
 */
export const delCheckroomById = (id: number) =>
  http.delete(`/checkRoom/delete/${id}`);

/**
 * 批量删除
 */
export const delCheckroomAllByIds = (data: number[]) =>
  http.post("/checkRoom/deleteAll", data);

/**
 * 添加
 */
export const addCheckroom = (data: AddOrUpdateCheckRoomParams) =>
  http.post<AddOrUpdateCheckRoomResponse>("/checkRoom/add", data);

/**
 * 修改
 */
export const updateCheckroom = (data: AddOrUpdateCheckRoomParams) =>
  http.put<AddOrUpdateCheckRoomResponse>("/checkRoom/update", data);

/**
 * 根据id获取单条查房记录
 */
export const getCheckroomById = (id: number) =>
  http.get<checkRoomListItem>(`/checkRoom/get/${id}`);
