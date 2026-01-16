export interface NursingType {
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
}

// 护理服务列表项核心类型（对应 list 中的单个元素）
export interface CareServiceItem {
  id: number;
  companyId: number;
  name: string;
  content: string;
}

// 顶层返回数据类型（对应完整 JSON 结构）
export interface CareServiceResponse {
  counts: number;
  pageSize: number;
  list: CareServiceItem[]; // 嵌套护理服务列表数组
}

export interface NursingService {
  id: number;
  name: string;
  content: string;
}
