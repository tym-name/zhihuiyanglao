/**
 * 地址列表请求参数
 */
export interface AddressListParams {
  page: number; // 当前页码，从 1 开始
  pageSize: number; // 每页条数
}

/**
 * 列表项数据类型
 */
export interface QrcodeItem {
  id: number; // 项目ID
  companyId: number; // 公司ID
  name: string; // 名称
  qrcode: string; // 二维码图片路径
}

/**
 * 分页数据接口
 */
export interface PaginationData {
  counts: number; // 总条数
  pageSize: number; // 每页条数
  list: QrcodeItem[]; // 数据列表
}

/**
 * API响应格式
 */
export interface ApiResponse {
  code: number; // 状态码 (10000=成功)
  msg: string; // 消息
  data: PaginationData; // 数据
}

/**
 * 添加地址
 */
export interface AddAddressParams {
  id: number;
  name: string;
  qrcode: string;
}

/**
 * 修改地址
 */
export interface UpdateAddressParams {
  id: number;
  name: string;
  qrcode: string;
}
