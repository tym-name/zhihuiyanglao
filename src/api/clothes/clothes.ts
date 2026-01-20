import http from '../../utils/request';
import type { clothesData, ClothesList, uploadAddData, } from './clothesType';

/**
 * 洗衣错衣
 */
export const clothesList = (params: ClothesList) => http.get<clothesData>("/clothes/list", params);
/**
 * 详情
 */
export const clothesGet = (id: number) => http.get(`/clothes/get/${id}`);
/**
 * 单删
 */
export const clothesDelete = (id: number) => http.delete(`/clothes/delete/${id}`);
/**
 * 批量删除
 */
export const clothesDeleteAll = (ids: number[]) => http.post('/clothes/deleteAll', ids);
// 编辑
export const clothesUpdate = (params: ClothesList) => http.put<clothesData>('/clothes/update', params);
// 图片
export const uploadAdd = (params: uploadAddData) => http.post('/upload/add', params);
