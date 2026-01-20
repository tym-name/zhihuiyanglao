/**
 * 获取血糖记录列表
 */
export interface bloodSugarListParams {
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
  /** 添加时间（可选） */
  addTime?: string;
  /** 测量护工(员工)id（可选） */
  staffId?: number;
}

export interface bloodSugarListItem {
  id: number;
  companyId: number;
  elderlyId: number;
  addTime: string;
  addAccountId: number;
  val: string;
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
  staffName: null | string;
  staffPhoto: null | string;
}

export interface bloodSugarListResponse {
  counts: number;
  pageSize: number;
  list: bloodSugarListItem[];
}
