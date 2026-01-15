import http from "../../../utile/request";
import type {
  ActivityTypePageData,
  playListParams,
  playListResponse,
} from "./activityType";

/**
 * 获取院内活动列表
 */
export const getPlayList = (params: playListParams) =>
  http.get<playListResponse>("/api/play/list", params);

/**
 * 活动分类
 */
export const getPlayTypeList = () =>
  http.get<ActivityTypePageData>("/api/playType/list");

/**
 * 
 */
