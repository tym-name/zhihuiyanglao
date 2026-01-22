export interface drugsListParams {
  page?: string;
  pageSize?: string;
  name?: string;
  beginDate?: string;
  endDate?: string;
  bedId?: string;
}

export interface drugsListItem {
  /** 记录ID */
  id: number;
  /** 公司ID */
  companyId: number;
  /** 老人ID */
  elderlyId: number;
  /** 添加时间，格式：yyyy-MM-dd HH:mm:ss */
  addTime: string;
  /** 家属姓名 */
  familyName: string | null;
  /** 名称（未明确具体含义） */
  name: string | null;
  /** 数量 */
  counts: number;
  /** 单位 */
  unit: string | null;
  /** 过期时间 */
  expTime: string | null;
  /** 合计/总和 */
  sum: number;
  /** 规格/规范 */
  norms: string | null;
  /** 备注 */
  remarks: string | null;
  /** 添加账号ID */
  addAccountId: number;
  /** 床位ID（字段名疑似笔误，应为bedId） */
  begId: number;
  /** 床位名称 */
  begName: string | null;
  /** 身份证号（未明确归属） */
  idCard: string | null;
  /** 添加账号名称 */
  addAccountName: string;
  /** 老人姓名 */
  elderlyName: string;
  /** 老人照片路径 */
  elderlyPhoto: string;
  /** 老人性别（1-男，0-女） */
  elderlyGender: string;
  /** 老人身份证号 */
  elderlyIdCard: string;
  /** 房间名称 */
  houseName: string | null;
  /** 楼栋名称 */
  buildingName: string;
  /** 开始日期 */
  startDate: string | null;
  /** 结束日期 */
  endDate: string | null;
  /** 计划相关信息 */
  plans: string | null;
}

export interface drugsListResponse {
  counts: number;
  pageSize: number;
  list: drugsListItem[];
}
