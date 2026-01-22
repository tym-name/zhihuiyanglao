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
export interface Elderly {
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

/**
 * 老人信息详情
 */
export interface ElderlyDetails {
  id: number;
  playId: number;
  elderlyId: number;
  elderlyName: null | string; // 实际返回为 null，定义为 null 或 string 兼容后续可能的非 null 场景
  elderlyPhoto: null | string;
  begName: null | string;
  houseName: null | string;
  buildingName: string;
}

// 图片信息子接口
interface ElderlyPicture {
  id: number;
  playId: number;
  picture: string;
}

// 核心数据接口（对应外层 data 对象）
export interface ElderlyDetailsData {
  id: number;
  companyId: number;
  title: string;
  addTime: string;
  type: number;
  typeName: null | string;
  content: string;
  addAccountId: number;
  addAccountName: null | string;
  elderly: ElderlyDetails[]; // 老年人信息数组
  pictures: ElderlyPicture[]; // 图片信息数组
}

/**
 * 选择老人列表
 */

export interface ElderlyListParams {
  /** 当前页 */
  page?: string;
  /** 每页显示多少条 */
  pageSize?: string;
  /** 姓名（可选） */
  name?: string;
  /** 身份证号（可选） */
  idCard?: string;
  /** 床位id（可选） */
  begId?: number;
  /** 入住状态（可选） */
  state?: number;
  /** 房间id（可选） */
  houseId?: number;
}

export interface ElderlyListItem {
  id: number;
  companyId: number;
  name: string;
  mobile: string;
  photo: string;
  gender: number;
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
  state: number;
  addTime: string;
  addAccountId: number;
  stateName: string;
  begName: null | string; // 预留string类型，适配后续可能的非空值
  addAccountName: string;
  houseName: null | string; // 预留string类型，适配后续可能的非空值
  buildingName: string;
  health: null; // 若后续有具体数据结构，可替换为对应接口（如HealthInfo | null）
  selfCares: null; // 若后续有具体数据结构，可替换为对应接口（如SelfCareInfo | null）
  checkups: null; // 若后续有具体数据结构，可替换为对应接口（如CheckupInfo | null）
  family: null; // 若后续有具体数据结构，可替换为对应接口（如FamilyInfo | null）
}

export interface ElderlyListResponse {
  counts: number;
  pageSize: number;
  list: ElderlyListItem[];
}

/**
 * 添加
 */

export interface ActivityElderly {
  elderlyId: number;
}

export interface ActivityPicture {
  picture: string;
}

export interface AddPlayParams {
  title: string;
  type: number | null;
  content: string;
  elderly: ActivityElderly[];
  pictures: ActivityPicture[];
}

export interface Playelderly {
  id: number;
  playId: number;
  elderlyId: number;
  elderlyName: null | string; // 预留string类型，适配后续可能返回的老人姓名
  elderlyPhoto: null | string; // 预留string类型，适配后续可能返回的老人照片路径
  begName: null | string; // 预留string类型，适配后续可能返回的床位名称
  houseName: null | string; // 预留string类型，适配后续可能返回的房间名称
  buildingName: null | string; // 预留string类型，适配后续可能返回的楼栋名称
}

export interface PlayPictures {
  id: number;
  playId: number;
  picture: string;
}

export interface AddPlayResponse {
  id: number;
  companyId: number;
  title: string;
  addTime: string;
  type: number;
  typeName: null | string; // 预留string类型，适配后续可能返回的活动类型名称
  content: string;
  addAccountId: number;
  addAccountName: null | string; // 预留string类型，适配后续可能返回的创建人名称
  elderly: Playelderly[];
  pictures: PlayPictures[];
}
