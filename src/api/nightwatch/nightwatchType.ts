export interface NightType {
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
  name?: string;
  address?: string;
  state?: string;
  beginDate?: string;
  endDate?: string;
  dateRange?: string[];
}

// 图片子项类型
interface PatrolPicture {
  id: number;
  patrolId: number;
  picture: string;
}

// 巡查列表项核心类型
export interface PatrolItem {
  id: number;
  companyId: number;
  address: string | null | undefined; // 兼容 null、空字符串、正常字符串
  addTime: string;
  staffId: number;
  state: "正常" | "异常" | "未巡查" | null | undefined | ""; // 枚举所有可能的状态值
  comment: string | null | undefined;
  staffName: string;
  pictures: PatrolPicture[]; // 嵌套图片数组类型
}

// 顶层返回数据类型
export interface PatrolResponse {
  counts: number;
  pageSize: number;
  list: PatrolItem[];
}

export interface PatrolPayload {
  address: "";
  state: "";
  comment: "";
}
