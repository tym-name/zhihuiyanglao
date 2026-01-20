import http from "../../../utils/request";
import type {
  ActivityTypePageData,
  AddPlayParams,
  AddPlayResponse,
  ElderlyDetailsData,
  ElderlyListParams,
  ElderlyListResponse,
  playListParams,
  playListResponse,
} from "./activityType";

/**
 * 获取院内活动列表
 */
export const getPlayList = (params: playListParams) => http.get<playListResponse>("/play/list", params);

/**
 * 活动分类
 */
export const getPlayTypeList = () => http.get<ActivityTypePageData>("/playType/list");

/**
 * 获取单条院内活动信息
 */
export const playget = (id: number) => http.get<ElderlyDetailsData>(`/play/get/${id}`);

/**
 * 删除院内活动
 */
export const delPlay = (id: number) => http.delete(`/play/delete/${id}`);

/**
 * 批量删除
 */
export const delAllPlay = (ids: number[]) => http.post("/play/deleteAll", ids);

/**
 * 获取老人列表
 */
export const getElderlyList = (params: ElderlyListParams) =>
  http.get<ElderlyListResponse>("/elderly/list", params);

/**
 * 添加院内活动
 */
export const addPlay = (data: AddPlayParams) =>
  http.post<AddPlayResponse>("/play/add", data);

/**
 * 修改院内活动
 */
export const updatePlay = (data: AddPlayParams) =>
  http.put<AddPlayResponse>("/play/update", data);

