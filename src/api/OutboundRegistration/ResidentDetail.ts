/**
 * 老人健康信息子类型
 */
interface ElderlyHealth {
  // 健康记录ID
  id?: number;
  // 关联的老人ID
  elderlyId?: number;
  // 既往病史
  oldillness?: string;
  // 当前患病情况
  nowillness?: string;
  // 其他疾病
  otherillness?: string;
  // 其他情况说明
  otherCase?: string;
}

/**
 * 单条老人详情完整类型（接口返回值）
 */
export interface    ElderlyDetail {
  // 老人唯一ID
  id?: number;
  // 机构/公司ID
  companyId?: number;
  // 老人姓名
  name?: string;
  // 手机号码（可为空字符串）
  mobile?: string;
  // 头像图片路径
  photo?: string;
  // 性别（1=男/0=女）
  gender?: number;
  // 出生日期（YYYY-MM-DD格式）
  birthday?: string;
  // 籍贯
  nativePlace?: string;
  // 民族
  nation?: string;
  // 身份证号码
  idCard?: string;
  // 政治面貌
  politics?: string;
  // 社保卡号/信息
  socialCard?: string;
  // 婚姻状况
  marriage?: string;
  // 基础文化程度（能读写/文盲等）
  eduLevel?: string;
  // 学历（博士/大专等）
  education?: string;
  // 户籍所在地
  resident?: string;
  // 居住地址
  address?: string;
  // 床位ID
  begId?: number;
  // 房间ID（可为0）
  houseId?: number;
  // 状态编码（3=已入院）
  state?: number;
  // 记录添加时间（YYYY-MM-DD HH?:mm?:ss格式）
  addTime?: string;
  // 添加人账号ID
  addAccountId?: number;
  // 状态名称
  stateName?: string;
  // 床位名称
  begName?: string;
  // 添加人姓名
  addAccountName?: string;
  // 房间名称
  houseName?: string;
  // 楼栋名称
  buildingName?: string;
  // 健康信息子对象
  health?: ElderlyHealth;
  // 自我照护能力列表（当前为空数组，预留数组类型）
  selfCares?: unknown[];
  // 体检记录列表（当前为空数组，预留数组类型）
  checkups?: unknown[];
  // 家属信息列表（当前为空数组，预留数组类型）
  family?: unknown[];
}