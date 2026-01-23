import http from "../../utils/request";
import type { AgeGroupStatList, ElderlyList, homeType, LocationList, MonthStatList } from "./homeType";

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

/**
 * 首页列表
 */
export const getCompanyCount = () => http.get<LocationList>("/count/getCompanyCount");

/**
 * 首页列表
 */
export const getElderlyCount = () => http.get<ElderlyList>("/count/getElderlyCount");