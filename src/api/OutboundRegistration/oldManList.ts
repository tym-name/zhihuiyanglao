/**
 * 人员列表项（内层核心数据类型）
 */
export interface PersonItem {
  // 人员唯一ID
  id?: number;
  // 公司/机构ID
  companyId?: number;
  // 姓名
  name: string;
  // 手机号码（可为空字符串）
  mobile?: string;
  // 头像图片路径
  photo?: string;
  // 性别（0/1 标识，推测 0=女、1=男）
  gender?: number;
  // 出生日期（日期格式字符串）
  birthday?: string;
  // 籍贯
  nativePlace?: string;
  // 民族
  nation?: string;
  // 身份证号码
  idCard: string;
  // 政治面貌
  politics?: string;
  // 社保卡相关信息
  socialCard?: string;
  // 婚姻状况
  marriage?: string;
  // 文化程度（基础读写能力）
  eduLevel?: string;
  // 学历
  education?: string;
  // 户籍所在地
  resident?: string;
  // 居住地址
  address?: string;
  // 床位ID
  begId?: number;
  // 房间ID
  houseId?: number;
  // 状态编码（3 对应 已入院）
  state?: number;
  // 添加时间（日期时间格式字符串）
  addTime?: string;
  // 添加人账号ID
  addAccountId?: number;
  // 状态名称（已入院）
  stateName?: string;
  // 床位名称
  begName?: string;
  // 添加人姓名
  addAccountName?: string;
  // 房间名称
  houseName?: string;
  // 楼栋名称
  buildingName?: string;
  // 健康状况（当前为null，预留类型）
  health?: null;
  // 自我照护能力（当前为null，预留类型）
  selfCares?: null;
  // 体检记录（当前为null，预留类型）
  checkups?: null;
  // 家属信息（当前为null，预留类型）
  family?: null;
}

/**
 * 人员列表响应数据（外层容器类型）
 */
export interface PersonListResponse {
  // 数据总条数
  counts: number;
  // 每页显示条数
  pageSize: number;
  // 人员列表数组
  list: PersonItem[];
}


// 获取老人列表接口
export interface ApifoxModel {
    /**
     * 床位id
     */
    begId?: number;
    /**
     * 房间id
     */
    houseId?: number;
    /**
     * 身份证号
     */
    idCard?: string;
    /**
     * 姓名
     */
    name?: string;
    /**
     * 当前页
     */
    page?: string;
    /**
     * 每页显示多少条
     */
    pageSize?: string;
    /**
     * 入住状态
     */
    state?: number;
}