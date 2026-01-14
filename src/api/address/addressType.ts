export interface AddressType {
  page: number;
  pageSize: number;
}

/**
 * 列表项数据类型（对应JSON中list数组的每一项）
 */
export interface EntityItem {
  /** 记录唯一标识ID */
  id: number;
  /** 公司/机构ID */
  companyId: number; 
  /** 名称（楼宇、人员等业务名称） */
  name: string;
  /** 二维码图片路径（支持空字符串，对应无二维码场景） */
  qrcode: string;
}

/**
 * 完整分页返回数据类型（对应整个JSON结构）
 */
export interface EntityPageResponse {
  counts: number;
  pageSize: number;
  list: EntityItem[];
}

export interface EntityResponse {
  id: number;
  name: string;
  qrcode: string;
}
