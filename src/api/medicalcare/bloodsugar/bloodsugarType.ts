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
  elderlyName:  string;
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

/**
 * 添加和修改血糖
 */

export interface addOUpdateBloodSugarParams {
  id?: number;
  // 老年人ID
  elderlyId: number;
  // 工作人员ID
  staffId?: number;
  // 检测值（包含单位，如 "90mmol/L"）
  val: string;
}

export interface addOUpdateBloodSugarResponse {
  // 记录ID
  id: number;
  // 公司ID
  companyId: number;
  // 老年人ID
  elderlyId: number;
  // 记录添加时间（格式：YYYY-MM-DD HH:mm:ss）
  addTime: string;
  // 添加记录的账号ID
  addAccountId: number;
  // 检测值（包含单位，如 "90mmol/L"）
  val: string;
  // 业务相关ID（begId，具体含义需结合业务）
  begId: number;
  // 业务相关名称（可为空）
  begName: string | null;
  // 身份证号（可为空）
  idCard: string | null;
  // 添加人姓名（可为空）
  addAccountName: string | null;
  // 添加人头像URL（可为空）
  addAccountPhoto: string | null;
  // 老人姓名（可为空）
  elderlyName: string | null;
  // 老人头像URL（可为空）
  elderlyPhoto: string | null;
  // 老人性别（可为空，如 "男"/"女"）
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
  // 工作人员头像URL（可为空）
  staffPhoto: string | null;
}
