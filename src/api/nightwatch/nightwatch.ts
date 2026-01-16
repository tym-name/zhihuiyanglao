import http from "../../utils/request";
import type { NightType, PatrolItem, PatrolPayload, PatrolResponse } from "./nightwatchType";


/**
 * 夜巡列表
 */

export const patrolList=(params:NightType)=>http.get<PatrolResponse>("/patrol/list",params);

/**
 * 夜巡添加
 */

export const patrolAdd=(data:PatrolPayload)=>http.post<PatrolItem>("/patrol/add",data);

/**
 * 夜巡删除
 */

export const patrolDelete=(id:number)=>http.delete(`/patrol/delete/${id}`);

/**
 * 夜巡批量删除
 */

export const patrolDeleteAll=(id:number[])=>http.post('/patrol/deleteAll',id);


