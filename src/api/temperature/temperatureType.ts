export interface temperatureData {
  page: string;
  pageSize: string;
}

/**
 * 老人外出记录项的类型定义
 */
export interface ElderlyOutingItem {
  // 新增账号ID
  addAccountId: number;
  // 新增账号名称
  addAccountName: string;
  // 新增账号头像（无则为null）
  addAccountPhoto: string | null;
  // 记录新增时间
  addTime: string;
  // 起始ID（默认0）
  begId: number;
  // 起始名称（无则为null）
  begName: string | null;
  // 楼栋名称（空字符串表示无）
  buildingName: string;
  // 公司ID
  companyId: number;
  // 老人性别（1=男，2=女，根据业务调整）
  elderlyGender: string;
  // 老人ID
  elderlyId: number;
  // 老人身份证号
  elderlyIdCard: string;
  // 老人姓名
  elderlyName: string;
  // 老人头像地址
  elderlyPhoto: string;
  // 房屋名称（无则为null）
  houseName: string | null;
  // 记录唯一ID
  id: number;
  // 身份证号（与elderlyIdCard重复，需确认业务含义）
  idCard: string;
  // 工作人员ID
  staffId: number;
  // 工作人员姓名
  staffName: string;
  // 工作人员头像地址
  staffPhoto: string;
  // 状态值（1=已返回/未返回，需结合业务定义）
  val: string;
}

/**
 * 老人外出记录分页查询结果的类型定义
 */
export interface ElderlyOutingResponse {
  // 总记录数
  counts: number;
  // 分页列表数据
  list: ElderlyOutingItem[];
  // 每页条数
  pageSize: number;
}

/**
 * 老人体温记录/健康监测数据类型定义
 * 适配 elderlyId(老人ID)、staffId(工作人员ID)、val(体温值) 业务场景
 */
export interface ElderlyTemperatureRecord {
  /** 老人唯一标识ID */
  elderlyId: number;
  /** 记录体温的工作人员ID */
  staffId: number;
  /** 体温值（字符串类型，如"38度"、"36.5℃"等） */
  val: string;
}

/**
 * 老人体温记录基础类型（精准匹配原始数据结构）
 */
export interface ElderlyTemperatureBasic {
  id?:number,
  /** 老人唯一标识ID */
  elderlyId: number;
  elderlyName:string;
  /** 体温值（带单位的字符串，如"37.5度"、"38℃"） */
  val: string;
}

export interface ElderlyTemperatureRecordUpd {
  /** 老人唯一标识ID（数值类型） */
  elderlyId: number;
  /** 体温值（带单位的字符串，如"37.5度"、"38℃"） */
  val: string;
}
