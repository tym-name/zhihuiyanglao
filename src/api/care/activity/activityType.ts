/**
 * 院内活动列表
 */

export interface playListParams {
  page?: string; // 当前页
  pageSize?: string; // 每页显示多少条
  name: string; // 老人姓名
  beginDate: string; // 开始时间（格式：yyyy-MM-dd）
  endDate: string; // 结束时间（格式：yyyy-MM-dd）
  type: number | null; // 分类ID
  key: string; // 关键字
}

export interface playListResponse {
  counts: number;
  pageSize: number;
  list: playListItem[];
}

/**
 * 单个老人活动项接口
 */
export interface playListItem {
  id: number;
  companyId: number;
  title: string;
  addTime: string;
  type: number;
  typeName: string;
  content: null | string; // 该字段在JSON中为null，预留string类型应对后续可能的非空值
  addAccountId: number;
  addAccountName: string;
  elderly: Elderly[];
  pictures: null | string[]; // 该字段在JSON中为null，预留string[]类型应对后续可能的图片列表
}

/**
 * 活动参与老人信息接口
 */
interface Elderly {
  id: number;
  playId: number;
  elderlyId: number;
  elderlyName: string;
  elderlyPhoto: string;
  begName: null | string;
  houseName: null | string;
  buildingName: string;
}

export interface ActivityTypeItem {
  id: number;
  name: string;
}

export interface ActivityTypePageData {
  counts: number;
  pageSize: number;
  list: ActivityTypeItem[];
}
