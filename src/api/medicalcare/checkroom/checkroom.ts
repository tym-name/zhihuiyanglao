import http from "../../../utils/request";
import type {
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
