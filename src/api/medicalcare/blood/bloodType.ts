export interface bloodListParams {
  page?: string;
  pageSize?: number;
  staffName?: string;
  id?: number | null;
  name: string;
  begId: number | null;
}

export interface bloodItem {
  id: number;
  companyId: number;
  elderlyId: number;
  addTime: string;
  addAccountId: number;
  bloodPressure: string;
  pulse: string;
  begId: number;
  begName: string;
  idCard: string;
  addAccountName: string;
  addAccountPhoto: null | string; // 允许 null 或字符串类型（实际返回 null，预留字符串场景）
  elderlyName: string;
  elderlyPhoto: string;
  elderlyGender: string;
  elderlyIdCard: string;
  houseName: null | string; // 允许 null 或字符串类型
  buildingName: string;
  staffId: number;
  staffName: string;
  staffPhoto: string;
}
export interface bloodListResponse {
  counts: number;
  pageSize: number;
  list: bloodItem[]; // 数组类型，元素为上述列表项类型
}

/**
 * 楼栋列表
 */
export interface buildingListItem {
  id: number;
  companyId: number;
  name: string;
  addTime: string; // 日期时间格式字符串，保留原数据类型
  addAccountId: number;
  pid: number;
}

// 定义外层 data 对象对应的核心类型（对应完整的 data 结构）
export interface buildingListResponse {
  counts: number; // 总记录数，数字类型
  list: buildingListItem[]; // 列表数组，元素为上述 ListItem 类型
}

/** 级联选择器所需的树形结构类型（嵌套） */
export interface CascaderTreeNode {
  value: number; // 对应 FlatItem 的 id（级联选择器绑定值）
  label: string; // 对应 FlatItem 的 name（级联选择器展示文本）
  children?: CascaderTreeNode[]; // 子节点，嵌套结构
}

/**
 * 添加血压记录
 */
export interface bloodAddOrUpdateParams {
  // 老年人ID，数字类型
  elderlyId: number | null;
  // 血压值，字符串类型（包含单位 mmHg）
  bloodPressure: string;
  // 工作人员ID，数字类型
  staffId?: number;
  // 脉搏值，字符串类型（包含单位 次/分）
  pulse: string;
}

export interface bloodAddOrUpdateResponse {
  // 非空数字类型字段
  id: number;
  companyId: number;
  elderlyId: number;
  addAccountId: number;
  staffId: number;
  // 非空字符串类型字段
  addTime: string;
  bloodPressure: string;
  pulse: string;
  // 允许为 null 的字段（联合类型：对应原始类型 | null）
  begId: number | null;
  begName: string | null;
  idCard: string | null;
  addAccountName: string | null;
  addAccountPhoto: string | null;
  elderlyName: string | null;
  elderlyPhoto: string | null;
  elderlyGender: string | null; // 性别通常是字符串（如"男"/"女"），允许为null
  elderlyIdCard: string | null;
  houseName: string | null;
  buildingName: string | null;
  staffName: string | null;
  staffPhoto: string | null;
}
