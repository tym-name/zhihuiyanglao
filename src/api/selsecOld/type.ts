// 老人信息的返回类型
   export interface PaginationResponse {
  counts: number;
  pageSize: number;
  list: Elderly[];
}


// 定义老人信息接口
export interface Elderly {
  id: number;
  companyId: number;
  name: string;
  mobile: string;
  photo: string;
  gender: number;  // 0: 女, 1: 男
  birthday: string;
  nativePlace: string;
  nation: string;
  idCard: string;
  politics: string;
  socialCard: string;
  marriage: string;
  eduLevel: string;
  education: string;
  resident: string;
  address: string;
  begId: number;
  houseId: number;
  state: number;  // 状态: 1-未签约, 2-预定中, 3-已入院, 4-已出院
  addTime: string;
  addAccountId: number;
  stateName: string;
  begName: string | null;
  addAccountName: string;
  houseName: string | null;
  buildingName: string;
  health: any | null;
  selfCares: any | null;
  checkups: any | null;
  family: any | null;
}


/**
 * 老人信息的请求参数
 */
export interface elderlyParams {
  page?: number;
  pageSize?: number;
  name?: string;
  idCard?: number;
}