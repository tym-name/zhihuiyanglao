import http from "../../utils/request";
import type { ConsultRecord, ConsultRecordItem, ConsultRegisterParams, QuestionData } from "./QuestionType";


/**
 * 预定列表
 */

export const questionList = (params: QuestionData) => http.get<ConsultRecordItem>("/question/list", params);

/**
 * 获取单条咨询信息
 */

export const questionGet = (id: number) => http.get<any>(`/question/get/${id}`);

/**
 * 删除咨询信息
 */

export const questionDelete = (id: number) => http.delete(`/question/delete/${id}`);

/**
 * 咨询添加
 */

export const questionAdd = (data: ConsultRegisterParams) => http.post<ConsultRegisterParams>("/question/add", data);

/**
 * 咨询信息修改
 */

export const questionUpdate = (data: ConsultRecord) => http.put<ConsultRecord>("/question/update", data);

