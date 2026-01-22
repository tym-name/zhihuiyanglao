

export interface ElderlyOutRecordParams {
  elderlyId: number;    // 老年人ID
  startTime: string;    // 开始时间 (格式: YYYY-MM-DD)
  endTime: string;      // 结束时间 (格式: YYYY-MM-DD)
  mobile: string;       // 联系电话
  address: string;      // 目的地地址
  content: string;      // 外出理由/内容
  relation: string;     // 关系
  name: string;         // 外出人员姓名
}





/**
 * 老人外出记录列表项接口（单个记录）
 */
export interface ElderlyOutRecordItem {
  // 基础主键与关联ID
  id?:number;
  companyId?: number;
  elderlyId?: number;
  
  // 外出时间区间
  beginDate:string;
  endDate?:string;
  startTime?: string;
  endTime?: string;
  
  // 外出相关信息
  mobile?: string;
  address?: string;
  content?: string;
  state?: number;
  relation?: string;
  name: string;
  
  // 记录新增信息
  addTime?: string;
  addAccountId?: number;
  addAccountName?: string;
  
  // 可选空值属性（部分记录为null）
  begName?: string | null;
  elderlyName?: string;
  elderlyPhoto?: string;
  elderlyGender?: string;
  elderlyIdCard?: string;
  houseName?: string | null;
  buildingName?: string;
  stateName?: string;
  
  // 暂未填充数据（全为null，预留扩展类型）
  pictures?: null | unknown; // 后续若为图片数组，可改为 string[] | null
  goBack?: null | unknown;   // 后续若有返回数据，可改为对应类型 | null
}

/**
 * 老人外出记录分页响应接口（外层整体结构）
 */
export interface ElderlyOutRecordPageResponse {
  total: any;
  // 总记录数
  counts: number;
  // 每页显示条数
  pageSize: number;
  // 核心数据列表
  list: ElderlyOutRecordItem[];
}

/**
 * 老人信息接口
 */
export interface ElderlyItem {
  avatar: string;
  id: number;
  companyId: number;
  name: string;
  mobile?: string;
  photo?: string; // 图片路径，可能为空字符串
  gender?: 0 | 1; // 0: 女, 1: 男
  birthday?: string; // YYYY-MM-DD 格式
  nativePlace?: string;
  nation?: string;
  idCard?: string;
  politics?: string;
  socialCard?: string;
  marriage?: string;
  eduLevel?: string;
  education?: string;
  resident?: string;
  address?: string;
  begId?: number;
  houseId?: number;
  state?: number; // 状态码，如 3 表示已入院
  addTime?: string; // YYYY-MM-DD HH:mm:ss
  addAccountId?: number;
  stateName?: string; // 状态描述，如 "已入院"
  begName?: string; // 床位号，如 "122-55"
  addAccountName?: string; // 添加人姓名
  houseName?: string;
  buildingName?: string;
  health?: string | null;
  selfCares?: string | null;
  checkups?: string | null;
  family?: string | null;
}



// 衣物问题项类型
export interface ClotheIssueItem {
  id: number
  elderlyId: number
  title: string
  content: string
  type: string
  state: string
  pictures: Array<{ file: string }>
  createTime: string
  updateTime: string
}

// 查询参数类型
export interface QueryParams {
  page: string
  pageSize: string
  name: string
  elderlyName: string
  state: string
  beginDate: string
  endDate: string
  type: string
}