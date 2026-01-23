import http from "../../utils/request";
import type { PaginationResponse, ReservationData, ReserveInfo, ReserveRelationInfo } from "./ReserveType";


/**
 * 预定列表
 */

export const reservationList = (params: ReservationData) => http.get<PaginationResponse>("/reservation/list", params);

/**
 * 获取单条预定信息 
 */

export const reservationGet = (id: number) => http.get(`/reservation/get/${id}`);

/**
 * 删除预定信息
 */

export const reservationDelete = (id: number) => http.delete(`/reservation/delete/${id}`);

/**
 * 预定添加
 */

export const reservationAdd = (data: ReserveInfo) => http.post<ReserveInfo>("/reservation/add", data);

/**
 * 预定信息修改
 */

export const reservationUpdate = (data: ReserveRelationInfo) => http.put<ReserveRelationInfo>("/reservation/update", data);

