/**
 * 查房记录列表
 */

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
  companyId: number;
  elderlyId: number;
  addTime: string;
  addAccountId: number;
  spirit: string;
  diet: string;
  sleep: string;
  shit: null | string; // 支持 null 和 字符串类型（后续有值时大概率为string）
  urinate: null | string;
  communicate: null | string;
  memory: null | string;
  temperature: null | string | number; // 体温可能是字符串或数字类型
  pulse: null | string | number; // 脉搏可能是字符串或数字类型
  breathe: null | string | number; // 呼吸相关可能是字符串或数字类型
  blood: null | string; // 血压等信息大概率为字符串
  description: null | string;
  suggest: null | string;
  begId: number;
  begName: null | string;
  idCard: null | string;
  addAccountName: string;
  addAccountPhoto: null | string;
  elderlyName: null | string;
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
