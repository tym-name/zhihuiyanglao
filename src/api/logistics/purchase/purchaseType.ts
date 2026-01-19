/**
 * 采购申请列表
 */

export interface purchaseParams {
  pageSize: string; // 每页显示多少条，默认10
  page: string; // 当前页面，默认1
  companyId: string; // 机构id
  state: string; // 状态
  beginDate: string; // 开始日期，格式yyyy-MM-dd
  endDate: string; // 结束日期，格式yyyy-MM-dd
}

export interface purchasListItem {
  id: number;
  companyId: number;
  receiveTime: string;
  addTime: string;
  addAccountId: number;
  picture: null | unknown;
  remarks: string;
  state: string;
  addAccountName: string;
  companyName: string;
  counts: number;
  purchasePrice: number;
  foods: null | unknown;
}

export interface purchasListResponse {
  counts: number;
  pageSize: number;
  list: purchasListItem[];
}
