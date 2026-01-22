export interface customerParams {
   page: number;
   pageSize: number;
}



// 添加潜在客户
interface ElderlyFamily {
  /** 家属姓名 */
  name: string;
  /** 家属手机号 */
  mobile: string;
  /** 家属身份证号 */
  idCard: string;
  /** 与老人的关系（如：父子关系） */
  relation: string;
  /** 家属性别（1-男，2-女，可根据业务扩展） */
  gender: number;
  /** 家属地址 */
  address: string;
}

/**
 * 老人基础信息类型
 */
export interface ElderlyInfoAdd {
  /** 老人姓名 */
  name: string;
  /** 老人手机号 */
  mobile: string;
  /** 老人性别（1-男，2-女） */
  gender: number;
  /** 老人出生日期（可为null） */
  birthday: string | null; // 建议用string（如'YYYY-MM-DD'）或Date类型，根据实际业务
  /** 老人状况描述 */
  status: string;
  /** 老人身份证号 */
  idCard: string;
  /** 房间需求描述 */
  roomRequire: string;
  /** 意向描述 */
  content: string;
  /** 状态（1-有效，0-无效，可根据业务扩展） */
  state: number;
  /** 来源（如：线下推荐、线上咨询等） */
  source: string;
  /** 家属列表 */
  family: ElderlyFamily[];
}

//修改潜在客户
export interface ElderlyInfo {
  /** 老人唯一标识ID */
  id: number;
  /** 老人姓名 */
  name: string;
  /** 老人手机号 */
  mobile: string;
  /** 老人性别（1-男，2-女） */
  gender: number;
  /** 老人出生日期（可为null） */
  birthday: string | null; // 建议用 'YYYY-MM-DD' 格式字符串，也可根据业务改为 Date 类型
  /** 老人状况描述 */
  status: string;
  /** 老人身份证号 */
  idCard: string;
  /** 房间需求描述 */
  roomRequire: string;
  /** 意向描述 */
  content: string;
  /** 状态（0-无效/未启用，1-有效/已启用） */
  state: number;
  /** 来源（如：在线咨询、线下推荐等） */
  source: string;
  /** 家属列表 */
  family: ElderlyFamily[];
}