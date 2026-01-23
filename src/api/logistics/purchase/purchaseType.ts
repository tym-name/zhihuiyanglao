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

/**
 * 添加采购申请
 */
export interface purchaseItem {
  /** 食品名称 */
  foodName: string;
  /** 单位（如：斤、个） */
  unit: string;
  /** 供应商ID */
  supplierId: number;
  /** 批发价 */
  wholePrice: number;
  /** 售价 */
  sellPrice: number;
  /** 采购价 */
  purchasePrice: number;
  /** 采购数量 */
  purchaseCounts: number;
}

export interface addPurchaseParams {
  /** 收货时间 */
  receiveTime: string;
  /** 备注信息 */
  remarks: string;
  /** 食品列表 */
  foods: purchaseItem[];
}

export interface addPurchaseItemResponse {
  /** 子项ID */
  id: number;
  /** 采购单主ID */
  purchaseId: number;
  /** 食品名称 */
  foodName: string;
  /** 单位（如：斤、个） */
  unit: string;
  /** 供应商ID */
  supplierId: number;
  /** 批发价 */
  wholePrice: number;
  /** 售价 */
  sellPrice: number;
  /** 采购价 */
  purchasePrice: number;
  /** 采购数量 */
  purchaseCounts: number;
  /** 收货数量 */
  receiveCounts: number;
  /** 供应商名称（可能为空） */
  supplierName: string | null;
}

/**
 * 采购单主信息接口
 */
export interface addPurchaseResponse {
  /** 采购单ID */
  id: number;
  /** 公司ID */
  companyId: number;
  /** 收货时间 */
  receiveTime: string;
  /** 新增时间 */
  addTime: string;
  /** 新增账号ID */
  addAccountId: number;
  /** 图片（可能为空） */
  picture: string | null;
  /** 备注 */
  remarks: string;
  /** 采购单状态 */
  state: string;
  /** 新增账号名称（可能为空） */
  addAccountName: string | null;
  /** 公司名称（可能为空） */
  companyName: string | null;
  /** 总数量 */
  counts: number;
  /** 总采购价（可能为空） */
  purchasePrice: number | null;
  /** 采购食品列表 */
  foods: addPurchaseItemResponse[];
}
/**
 *根据id获取单条采购申请信息
 */
export interface purchaseGetResponse {
  id: number;
  /** 公司ID */
  companyId: number;
  /** 期望到货时间（带时分秒） */
  receiveTime: string;
  /** 采购单创建时间 */
  addTime: string;
  /** 创建人账号ID */
  addAccountId: number;
  /** 附件图片地址（空字符串，非null） */
  picture: string;
  /** 备注信息 */
  remarks: string;
  /** 采购单状态 */
  state: string;
  /** 创建人名称 */
  addAccountName: string;
  /** 所属公司名称 */
  companyName: string;
  /** 采购品种数量 */
  counts: number;
  /** 实际采购总成本（未计算/无数据时为null） */
  purchasePrice: number | null;
  /** 采购食材列表（无数据时为null） */
  foods: any[] | null; // 若
}

/**
 *根据采购id获取采购物品
 */
export interface PurchaseFoodListItem {
  /** 明细项ID */
  id: number;
  /** 所属采购单ID */
  purchaseId: number;
  /** 食材名称 */
  foodName: string;
  /** 单位（如：斤、吨） */
  unit: string;
  /** 供应商ID */
  supplierId: number;
  /** 批发价（小数） */
  wholePrice: number;
  /** 零售价（小数） */
  sellPrice: number;
  /** 采购价（小数） */
  purchasePrice: number;
  /** 采购数量 */
  purchaseCounts: number;
  /** 收货数量 */
  receiveCounts: number;
  /** 供应商名称 */
  supplierName: string;
}

/**
 * 采购单食材明细列表响应数据接口
 */
export interface PurchaseFoodsResponse {
  list: PurchaseFoodListItem[];
}

/**
 * 收货验收
 */
export interface PurchaseCheckFoodItem {
  /** 食材明细项ID */
  id: number;
  /** 收货数量（初始为0） */
  receiveCounts: number;
}

export interface PurchaseCheckParams {
  /** 采购单ID */
  id: number;
  /** 附件图片地址（空字符串） */
  picture: string;
  /** 采购食材收货明细列表 */
  foods: PurchaseCheckFoodItem[];
}

export interface PurchaseFoodItem {
  /** 食材明细ID */
  id: number;
  /** 所属采购单ID */
  purchaseId: number;
  /** 食材名称（可能为null） */
  foodName: string | null;
  /** 计量单位（可能为null） */
  unit: string | null;
  /** 供应商ID（默认0） */
  supplierId: number;
  /** 批发价（可能为null） */
  wholePrice: number | null;
  /** 零售价（可能为null） */
  sellPrice: number | null;
  /** 采购价（可能为null） */
  purchasePrice: number | null;
  /** 采购数量（默认0） */
  purchaseCounts: number;
  /** 收货数量（默认0） */
  receiveCounts: number;
  /** 供应商名称（可能为null） */
  supplierName: string | null;
}

/**
 * 采购单主信息接口（含大量null/0值场景）
 */
export interface PurchaseOrder {
  /** 采购单ID */
  id: number;
  /** 公司ID（默认0） */
  companyId: number;
  /** 期望到货时间（可能为null） */
  receiveTime: string | null;
  /** 创建时间（可能为null） */
  addTime: string | null;
  /** 创建人账号ID（默认0） */
  addAccountId: number;
  /** 图片地址（空字符串，非null） */
  picture: string;
  /** 备注（可能为null） */
  remarks: string | null;
  /** 采购单状态 */
  state: string;
  /** 创建人名称（可能为null） */
  addAccountName: string | null;
  /** 公司名称（可能为null） */
  companyName: string | null;
  /** 采购品种数（默认0） */
  counts: number;
  /** 采购总成本（可能为null） */
  purchasePrice: number | null;
  /** 采购食材列表 */
  foods: PurchaseFoodItem[];
}
