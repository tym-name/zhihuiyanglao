/**
 * 食材管理列表
 */
export interface foodListType {
  pageSize: number;
  page: number;
}

// 商品列表项的类型
export interface FoodItem {
  id: number;
  companyId: number;
  name: string;
  unit: string;
  supplierId: number;
  wholePrice: number | null; // 批发价，可能为null
  sellPrice: number | null; // 售价，可能为null
  purchasePrice: number | null; // 采购价，可能为null
  updateTime: string | null; // 更新时间，可能为null（通常为字符串格式）
  supplierName: string;
}

// 响应数据中 data 部分的类型
export interface FoodResponseData {
  counts: number; // 总数量
  pageSize: number; // 每页条数
  list: FoodItem[]; // 商品列表
}

// 完整的接口响应类型
export interface FoodListResponse {
  code: number; // 响应码
  msg: string; // 响应信息
  data: FoodResponseData; // 响应数据主体
}

/**
 * 供应商
 */

export interface supplierListType {
  pageSize: number;
  page: number;
}

// 供应商列表项的类型（核心数据结构）
export interface SupplierItem {
  id: number; // 供应商ID
  companyId: number; // 所属公司ID
  name: string; // 供应商名称
  linkMan: string; // 联系人
  mobile: string; // 联系电话
  foodCounts: number; // 关联食品数量
}

// 响应数据中 data 部分的分页数据类型
export interface SupplierResponseData {
  counts: number; // 总记录数
  pageSize: number; // 每页条数
  list: SupplierItem[]; // 供应商列表数组
}

/**
 * 添加食品
 */
export interface FoodsAddType {
  id?: number | null; // 商品ID
  name: string; // 商品名称
  unit: string; // 商品单位
  supplierId: number | null; // 供应商ID
}

export interface FoodsAddData {
  id: number; // 商品ID
  companyId: number; // 所属公司ID
  name: string; // 商品名称
  unit: string; // 商品单位
  supplierId: number; // 供应商ID
  wholePrice: number | null; // 批发价（可能为null）
  sellPrice: number | null; // 售价（可能为null）
  purchasePrice: number | null; // 采购价（可能为null）
  updateTime: string | null; // 更新时间（可能为null，通常为字符串格式）
  supplierName: string | null; // 供应商名称（可能为null）
}

/**
 * 修改食品价格
 */

export interface FoodPriceType {
  /** 记录唯一标识ID */
  id: number;
  /** 关联的食品ID */
  foodId: number;
  /** 总价/整体价格（浮点型，保留小数） */
  wholePrice: number | null;
  /** 销售价格（浮点型，保留小数） */
  sellPrice: number | null;
  /** 采购价格（浮点型，保留小数） */
  purchasePrice: number | null;
}

export interface FoodPriceResponse {
  /** 记录唯一标识ID */
  id: number;
  /** 关联的食品ID */
  foodId: number;
  /** 总价/整体价格（浮点型，保留小数） */
  wholePrice: number;
  /** 销售价格（浮点型，保留小数） */
  sellPrice: number;
  /** 采购价格（浮点型，保留小数） */
  purchasePrice: number;
  /** 更新时间（可能为 null，无更新时为空） */
  updateTime: string | null;
  /** 新增记录的账户ID（默认 0，无账户时为 0） */
  addAccountId: number;
  /** 新增记录的账户名称（可能为 null，无账户时为空） */
  addAccountName: string | null;
}

/**
 * 根据食材id获取价格列表
 */

export interface FoodPriceListItem {
  id: number;
  foodId: number;
  wholePrice: number | null;
  sellPrice: number | null;
  purchasePrice: number | null;
  updateTime: string | null; // 可能是有效时间字符串或 null
  addAccountId: number | null;
  addAccountName: string | null; // 可能是字符串或 null
}

export interface FoodPriceListData {
  counts: number;
  pageSize: number;
  list: FoodPriceListItem[]; // 列表项数组
}
