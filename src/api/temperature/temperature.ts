import http from '../../utils/request';
import type { ElderlyOutingItem, ElderlyTemperatureRecord, ElderlyTemperatureRecordUpd, temperatureData } from './temperatureType';

/**
 * 体温记录分组列表
 */
export const temperatureListGroup = (params: temperatureData) => http.get<any>("/temperature/listGroup", params);

/**
 * 体温记录列表
 */
export const temperatureList = (params: temperatureData) => http.get<ElderlyOutingItem>("/temperature/list", params);

/**
 * 获取单条体温记录信息
 */
export const temperatureGet = (id: number) => http.get(`/temperature/get/${id}`);

/**
 * 删除体温记录信息
 */
export const temperatureDelete = (id: number) => http.delete<ElderlyOutingItem>(`/temperature/delete/${id}`);

/**
 * 体温记录添加
 */
export const temperatureAdd = (data: ElderlyTemperatureRecord) => http.post<ElderlyTemperatureRecord>("/temperature/add", data);



/**
 * 体温记录修改
 */
export const temperatureUpdate = (data: ElderlyTemperatureRecordUpd) => http.put<ElderlyTemperatureRecordUpd>("/temperature/update", data);




