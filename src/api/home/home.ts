import http from "../../utils/request";
import type { AgeGroupStatList, homeType, MonthStatList } from "./homeType";

/**
 * 首页列表
 */
export const countList = () => http.get<homeType>("/count/list");

/**
 * 首页列表
 */
export const getOrderCount = () => http.get<MonthStatList>("/count/getOrderCount");

/**
 * 首页列表
 */
export const getAgeGroup = () => http.get<AgeGroupStatList>("/count/getAgeGroup");