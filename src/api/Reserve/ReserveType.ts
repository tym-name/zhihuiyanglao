export interface ReservationData {
  page: number;
  pageSize: number;
}

export interface PaginationResponse {
  /** 总条数 */
  counts: number;
  /** 每页条数 */
  pageSize: number;
  /** 数据列表（泛型定义，可根据实际数据类型替换 T） */
  list: any[]; // 如果知道list里的具体数据类型，可替换为更具体的类型，比如 User[] / Elderly[]
}

/**
 * 文件附件子模型
 */
interface FileItem {
  /** 文件路径/标识 */
  file: string;
  /** 文件名称 */
  fileName: string;
}

/**
 * 老人费用/关系信息主模型
 */
export interface ReserveInfo {
  /** 老人ID */
  elderlyId: number;
  /** 姓名 */
  name: string;
  /** 手机号码 */
  mobile: string;
  /** 亲属关系 */
  relation: string;
  /** 开始ID（业务标识，根据实际场景调整注释） */
  begId: number;
  /** 开始日期 */
  startDate: string;
  /** 天数 */
  day: number;
  /** 金额 */
  amount: number;
  /** 文件附件列表 */
  files: FileItem[];
}


/**
 * 老人费用/关系信息主模型（新增id字段）
 */
export interface ReserveRelationInfo {
  /** 主键ID */
  id: number;
  /** 老人ID */
  elderlyId: number;
  /** 姓名 */
  name: string;
  /** 手机号码 */
  mobile: string;
  /** 亲属关系 */
  relation: string;
  /** 业务标识ID（begId，根据实际业务调整注释） */
  bed: string;
  /** 开始日期 */
  startDate: string;
  /** 天数 */
  day: number;
  /** 金额 */
  amount: number;
  /** 文件附件列表（仅含file字段） */
  files: Array<{ // 修正为Array类型，兼容更多场景
    file: string;
  }>;
}