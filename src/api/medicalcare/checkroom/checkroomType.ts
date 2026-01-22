/**
 * 查房记录列表
 */

import type { s } from "vue-router/dist/router-CWoNjPRp.mjs";

export interface checkRoomListParams {
  /** 当前页 */
  page?: string;
  /** 每页显示多少条 */
  pageSize?: string;
  /** 老人姓名（可选） */
  name?: string;
  /** 开始时间，格式：yyyy-MM-dd（可选） */
  beginDate?: string;
  /** 结束时间，格式：yyyy-MM-dd（可选） */
  endDate?: string;
  /** 床位ID（可选） */
  begId?: string | null | number;
  /** 查房时间（可选） */
  addTime?: string;
  /** 员工（查房医生）id（可选） */
  staffId?: number;
}

export interface checkRoomListItem {
  id: number;
  companyId: number | null;
  elderlyId: number | null;
  addTime: string;
  addAccountId: number;
  spirit: string;
  diet: string;
  sleep: string;
  shit: string; // 支持 null 和 字符串类型（后续有值时大概率为string）
  urinate: string;
  communicate: string;
  memory: string;
  temperature: string; // 体温可能是字符串或数字类型
  pulse: string; // 脉搏可能是字符串或数字类型
  breathe: string; // 呼吸相关可能是字符串或数字类型
  blood: string; // 血压等信息大概率为字符串
  description: null | string;
  suggest: null | string;
  begId: number;
  begName: null | string;
  idCard: null | string;
  addAccountName: string;
  addAccountPhoto: null | string;
  elderlyName: string;
  elderlyPhoto: null | string;
  elderlyGender: null | string | number; // 性别可能是字符串（男/女）或数字（0/1）
  elderlyIdCard: null | string;
  houseName: null | string;
  buildingName: string;
  staffId: number;
  staffName: string;
  staffPhoto: string;
}

/**
 * 根数据类型（包含分页信息和记录列表）
 */
export interface checkRoomListResponse {
  counts: number;
  pageSize: number;
  list: checkRoomListItem[];
}

/**
 * 添加
 */
export interface AddOrUpdateCheckRoomParams {
  id?: number;
  // 老年人ID
  elderlyId: number | null;
  // 工作人员ID
  staffId?: number;
  // 精神状态
  spirit: "正常" | "异常" | string;
  // 饮食状态
  diet: "正常" | "异常" | string;
  // 睡眠状态
  sleep: "正常" | "异常" | string;
  // 排便状态
  shit: "正常" | "异常" | string;
  // 排尿状态
  urinate: "正常" | "异常" | string;
  // 沟通状态
  communicate: "正常" | "异常" | string;
  // 记忆状态
  memory: "正常" | "异常" | string;
  // 体温状态
  temperature: "正常" | "异常" | string;
  // 异常情况说明
  description?: string;
  // 脉搏状态
  pulse: "正常" | "异常" | string;
  // 呼吸状态
  breathe: "正常" | "异常" | string;
  // 血压/血液状态
  blood: "正常" | "异常" | string;
  // 建议
  suggest: null | string;
}

export interface AddOrUpdateCheckRoomResponse {
  // 记录ID
  id: number;
  // 公司ID
  companyId: number;
  // 老年人ID
  elderlyId: number;
  // 记录添加时间
  addTime: string;
  // 添加记录的账号ID
  addAccountId: number;
  // 精神状态
  spirit: "正常" | "异常";
  // 饮食状态
  diet: "正常" | "异常";
  // 睡眠状态
  sleep: "正常" | "异常";
  // 排便状态
  shit: "正常" | "异常";
  // 排尿状态
  urinate: "正常" | "异常";
  // 沟通状态
  communicate: "正常" | "异常";
  // 记忆状态
  memory: "正常" | "异常";
  // 体温状态
  temperature: "正常" | "异常";
  // 脉搏状态
  pulse: "正常" | "异常";
  // 呼吸状态
  breathe: "正常" | "异常";
  // 血压/血液状态
  blood: "正常" | "异常";
  // 异常情况说明（可为空）
  description: string | null;
  // 建议
  suggest: string;
  // 未知业务ID（begId）
  begId: number;
  // 未知业务名称（可为空）
  begName: string | null;
  // 身份证号（可为空）
  idCard: string | null;
  // 添加人姓名（可为空）
  addAccountName: string | null;
  // 添加人头像（可为空）
  addAccountPhoto: string | null;
  // 老人姓名（可为空）
  elderlyName: string | null;
  // 老人头像（可为空）
  elderlyPhoto: string | null;
  // 老人性别（可为空）
  elderlyGender: string | null;
  // 老人身份证号（可为空）
  elderlyIdCard: string | null;
  // 房屋名称（可为空）
  houseName: string | null;
  // 楼栋名称（可为空）
  buildingName: string | null;
  // 工作人员ID
  staffId: number;
  // 工作人员姓名（可为空）
  staffName: string | null;
  // 工作人员头像（可为空）
  staffPhoto: string | null;
}
