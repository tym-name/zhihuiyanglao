import http from "../../utils/request";
<<<<<<< HEAD
import type { bedsData } from "./buildingType";

/**
 * 床位列表
 */
export const getBedsList = (params?: bedsData) => http.get<any>("/beds/list", params);
=======
import type { BuildingItem, BuildingResponse, RuleForm } from "../market/elderlyType";

>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7

/**
 * 楼栋列表
 */
<<<<<<< HEAD
export const getBuildingList = () => http.get<any>("/building/list", );

/**
 * 床位列表
 */
export const getHouseList = (params?: bedsData) => http.get<any>("/house/list", params);


=======

export const buildingList=()=>http.get<BuildingResponse>("/building/list");

/**
 * 楼栋添加
 */

export const buildingAdd=(data:RuleForm)=>http.post<BuildingItem>("/building/add",data);

/**
 * 楼栋修改
 */

export const buildingUpdate=(data:RuleForm)=>http.put<BuildingItem>("/building/update",data);

/**
 * 删除楼栋
 */
export const buildingDelete = (id: number) => http.delete(`/building/delete/${id}`);
>>>>>>> faba1291873781602f2deee1773d1a79a1b5e5a7
