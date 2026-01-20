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
