import http from "../../utils/request";
import type { bedsData } from "./buildingType";

/**
 * 床位列表
 */
export const getBedsList = (params?: bedsData) => http.get<any>("/beds/list", params);

/**
 * 楼栋列表
 */
export const getBuildingList = () => http.get<any>("/building/list", );

/**
 * 床位列表
 */
export const getHouseList = (params?: bedsData) => http.get<any>("/house/list", params);


