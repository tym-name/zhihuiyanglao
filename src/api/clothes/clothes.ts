import http from '../../utils/request';
import type { clothesData, ClothesList } from './clothesType';

/**
 * 洗衣错衣
 */
export const clothesList = (params: ClothesList) => http.get<clothesData>("/clothes/list", params);
/**
 * 详情
 */
export const clothesGet = (id: number) => http.get(`/clothes/get/${id}`);
