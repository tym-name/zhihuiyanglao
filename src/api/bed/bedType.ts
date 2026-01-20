export interface bedsListType {
  page: number;
  pageSize: number;
  houseId: string | undefined;
}

export interface HouseAccountInfo {
  // 新增账户ID
  addAccountId: number;
  // 新增账户名称
  addAccountName: string;
  // 新增时间
  addTime: string;
  // 公司ID
  companyId: number;
  // 房屋ID
  houseId: number;
  // 主键ID
  id: number;
  // 房屋名称/编号
  name: string;
  // 价格
  price: number;
  // 状态（0 代表某种默认状态，可根据业务补充注释）
  state: number;
}

export interface HouseAccountList {
  counts: number;
  pageSize: number;
  list: HouseAccountInfo[];
}

/**
 * 床位信息数据模型接口
 */
export interface BedInfo {
  id: number;
  closeDialog: () => void;
  houseName: string;
  houseId: number;
  name: string;
  price: number | undefined;
}
