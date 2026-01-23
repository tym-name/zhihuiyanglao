import http from "../../utils/request";
import type { BuildingItem, BuildingResponse, RuleForm } from "../market/elderlyType";


/**
 * 楼栋列表
 */

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
