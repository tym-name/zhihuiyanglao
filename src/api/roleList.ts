export interface roleData {
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
}

export interface ItemList {
  id: number;
  name: string;
  companyId: number;
  addAccountId: number;
  addAccountName: string;
  addTime: string;
  accountCounts: number;
  menuIds: null;
}

// 最外层的分页总数据类型
export interface PageData {
  counts: number;
  pageSize: number;
  list: ItemList[];
}