export interface supplier {
    page?: number;
    pageSize?: number;
}

// 分页查询返回的整体数据模型
export interface SupplierPageResult {
  counts: number;        // 总条数
  pageSize: number;      // 每页条数
  list: SupplierItem[];  // 供应商列表数据
}

// 单个供应商的实体数据模型
export interface SupplierItem {
  id: number;            // 供应商id
  companyId: number;     // 公司id
  name: string;          // 供应商名称
  linkMan: string;       // 联系人
  mobile: string;        // 联系电话
  foodCounts: number;    // 食品数量
}

export interface SupplierInfo {
  id: number;
  companyId: number;
  name: string;
  linkMan: string | null; // 允许 字符串 / null 两种值
  mobile: string;
  foodCounts: number;
}

export interface RuleForm {
    name: string
    linkMan: string
    mobile: string
    // foodCounts: number;
}
