export interface goOutType {
  page: number;
  pageSize: number;
}


/**
 * 老人外出记录列表返回数据模型
 */
export interface ElderlyOutingListResponse {
  counts: number; // 总条数
  pageSize: number; // 每页条数
  list: ElderlyOutingItem[]; // 外出记录列表
}

/**
 * 单条老人外出记录数据模型
 */
export interface ElderlyOutingItem {
  id: number; // 记录ID
  companyId: number; // 机构ID
  elderlyId: number; // 老人ID
  startTime: string; // 外出开始时间（格式：YYYY-MM-DD HH:mm:ss）
  endTime: string; // 外出结束时间（格式：YYYY-MM-DD HH:mm:ss）
  mobile: string; // 联系电话
  address: string; // 外出地址
  content: string; // 外出事由/内容
  state: number; // 状态（1=已返回，可扩展其他状态）
  relation: string; // 关系（为空字符串）
  name: string; // 联系人姓名
  addTime: string; // 记录添加时间
  addAccountId: number; // 添加人账号ID
  addAccountName: string; // 添加人姓名
  begName: string; // 床位名称（如：201-222）
  elderlyName: string; // 老人姓名
  elderlyPhoto: string; // 老人照片路径
  elderlyGender: string; // 老人性别（1=男，可扩展）
  elderlyIdCard: string; // 老人身份证号
  houseName: string; // 房间名称（如：201）
  buildingName: string; // 楼栋/单元信息（如：2楼2单元）
  stateName: string; // 状态名称（如：已返回）
  pictures: null | string; // 外出照片（null 表示无）
  goBack: null | string; // 返程相关信息（null 表示无）
}

/** 老人外出申请数据模型 */
export interface OutingApplication {
  // 核心必选字段
  id: number;                  // 申请记录ID
  companyId: number;           // 公司ID
  elderlyId: number;          // 老人ID
  startTime: string;           // 外出开始时间（格式：YYYY-MM-DD）
  endTime: string;             // 外出结束时间（格式：YYYY-MM-DD）
  mobile: string;              // 联系电话
  address: string;             // 外出地址
  content: string;             // 外出理由
  state: number;               // 申请状态（0-待审核/1-已通过/2-已拒绝等）
  relation: string;            // 与老人的关系
  name: string;                // 申请人姓名
  addTime: string;             // 申请提交时间（格式：YYYY-MM-DD HH:mm:ss）
  addAccountId: number;        // 提交人账号ID

  // 可选字段（可能为 null/undefined）
  addAccountName?: string | null;  // 提交人姓名
  begName?: string | null;         // 预留字段
  elderlyName?: string | null;     // 老人姓名
  elderlyPhoto?: string | null;    // 老人照片（通常为图片URL）
  elderlyGender?: string | null;   // 老人性别
  elderlyIdCard?: string | null;   // 老人身份证号
  houseName?: string | null;       // 房屋名称
  buildingName?: string | null;    // 楼栋名称
  stateName?: string | null;       // 状态名称（如"待审核"）
  pictures?: string | null;        // 附件图片（URL，多个可拼接为字符串）
  goBack?: string | null;          // 是否返回（如"是/否"）
}

/** 老人外出返回记录数据模型 */
export interface OutingReturnRecord {
  // 核心必选字段
  id: number;                  // 返回记录ID
  outId: number;               // 关联的外出申请ID
  addAccountId: number;        // 提交人账号ID
  addTime: string;             // 记录提交时间（格式：YYYY-MM-DD HH:mm:ss）
  backTime: string;            // 实际返回时间（格式：YYYY-MM-DD HH:mm:ss）
  content: string;             // 返回说明/备注

  // 可选字段（可能为 null/undefined）
  addAccountName?: string | null;  // 提交人姓名
  pictures?: string | null;        // 返回相关附件图片（URL，多个可拼接为字符串）
}

export interface OutingApplyCore {
  // 必选核心字段
  elderlyId: number;  // 老人ID
  startTime: string;  // 外出开始时间（格式：YYYY-MM-DD HH:mm）
  endTime: string;    // 外出结束时间（格式：YYYY-MM-DD HH:mm）
  mobile: string;     // 联系电话
  address: string;    // 外出地址
  content: string;    // 外出理由
  relation: string;   // 与老人的关系
  name: string;       // 申请人姓名
}