import http from '../../utils/request';
import type { clothesData, ClothesList } from './clothesType';

/**
 * 洗衣错衣
 */
export const clothesList = (params: ClothesList) => http.get<clothesData>("/api/clothes/list", params);
/**
 * 详情
 */
export const clothesGet = (id: number) => http.get(`/api/clothes/get/${id}`);
/**
 * 单删
 */
export const clothesDelete = (id: number) => http.delete(`/api/clothes/delete/${id}`);
/**
 * 批量删除
 */
export const clothesDeleteAll = (ids: number[]) => http.post('/api/clothes/deleteAll', ids);
// 编辑
export const clothesUpdate = (params: ClothesList) => http.put<clothesData>('/api/clothes/update', params);
