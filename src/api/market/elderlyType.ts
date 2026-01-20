export interface ElderlyType {
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
  name?: string;
  idCard?: string;
  begId?: number;
  state?:number | null;
}

// 单个人员信息的接口（对应JSON中的list数组元素）
export interface PersonInfo {
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
  begName: string;
  addAccountName: string;
  houseName: string;
  buildingName: string;
  health: null | any; // 实际业务中可替换为具体类型（如HealthInfo）
  selfCares: null | any; // 实际业务中可替换为具体类型（如SelfCareInfo）
  checkups: null | any; // 实际业务中可替换为具体类型（如CheckupInfo）
  family: null | any; // 实际业务中可替换为具体类型（如FamilyMember[]）
}

// 顶层数据接口（对应整个JSON对象）
export interface PersonListResponse {
  counts: number;
  pageSize: number;
  list: PersonInfo[]; // 人员信息数组
}

/**
 * 健康信息子类型
 */
interface HealthInfo {
  id: number;
  elderlyId: number;
  oldillness: string; // 既往病史
  nowillness: string; // 现病史
  otherillness: string; // 其他病史
  otherCase: string; // 其他情况
}

/**
 * 自理能力评估子类型
 */
export interface SelfCare {
  id: number;
  elderlyId: number;
  name: string; // 评估项名称（进食/修饰/穿衣等）
  val: string; // 评估值（正常/轻度依赖等）
  picture: string; // 体检报告图片路径
}

/**
 * 体检报告子类型
 */
export interface Checkup {
    id: number;
    name: string;
    val: string;
    picture: string;
    // 其他原有字段...
}

/**
 * 家属信息子类型
 */
export interface FamilyMember {
  id: number;
  elderlyId: number;
  name: string; // 家属姓名
  mobile: string; // 家属手机号
  idCard: string; // 家属身份证号
  relation: string; // 与老人关系（母子/父子等）
  gender: number; // 家属性别（1-男，2-女，可根据业务调整）
  address: string; // 家属地址
}

/**
 * 老人信息主类型
 */
export interface ElderlyInfos {
  id: number; // 老人ID
  companyId: number; // 机构ID
  name: string; // 老人姓名
  mobile: string; // 老人手机号
  photo: string; // 老人照片路径
  gender: number; // 老人性别（1-男，2-女）
  birthday: string; // 出生日期（YYYY-MM-DD）
  nativePlace: string; // 籍贯
  nation: string; // 民族
  idCard: string; // 身份证号
  politics: string; // 政治面貌
  socialCard: string; // 社保卡号
  marriage: string; // 婚姻状况
  eduLevel: string; // 文化程度
  education: string; // 学历
  resident: string; // 户籍
  address: string; // 居住地址
  begId: number; // 床位ID（0表示未分配）
  houseId: number; // 房屋ID（0表示未分配）
  state: number; // 状态（1-正常，可根据业务定义）
  addTime: string; // 添加时间（YYYY-MM-DD HH:mm:ss）
  addAccountId: number; // 添加人账号ID
  stateName: string | null; // 状态名称（null表示未设置）
  begName: string | null; // 床位名称（null表示未分配）
  addAccountName: string | null; // 添加人姓名（null表示未设置）
  houseName: string | null; // 房屋名称（null表示未分配）
  buildingName: string | null; // 楼栋名称（null表示未分配）
  health: HealthInfo; // 健康信息
  selfCares: SelfCare[]; // 自理能力评估列表
  checkups: Checkup[]; // 体检报告列表
  family: FamilyMember[]; // 家属信息列表
}

/**
 * 健康信息子类型（简化版，移除了 id/elderlyId）
 */
interface ElderlyHealth {
  oldillness: string; // 既往病史
  nowillness: string; // 现病史
  otherillness: string; // 其他病史
  otherCase: string; // 其他情况
}

/**
 * 自理能力评估子类型（简化版，移除了 id/elderlyId）
 */
export interface ElderlySelfCare {
  name: string; // 评估项名称（进食/修饰/穿衣/如厕、排泄/移动）
  val: string; // 评估值（正常/轻度依赖等）
}

/**
 * 体检报告子类型（简化版，移除了 id/elderlyId）
 */
export interface ElderlyCheckup {
  name: string; // 体检项目名称（肝功能+HbsAg/血脂全套等）
  picture: string; // 体检报告图片路径
}

/**
 * 家属信息子类型（仅保留有效字段）
 */
export interface ElderlyFamily {
  id: number; // 家属ID
  name: string; // 家属姓名
  mobile: string; // 家属手机号
  idCard: string; // 家属身份证号
  relation: string; // 与老人关系（母子/父子等）
  gender: number; // 家属性别（1-男，2-女）
  address: string; // 家属地址
}

/**
 * 老人信息主类型（简化版，匹配最新的 JSON 结构）
 */
export interface ElderlyInfoAdd {
  id: number;
  name: string; // 老人姓名
  mobile: string; // 老人手机号
  photo: string; // 老人照片路径
  gender: number; // 老人性别（1-男，2-女）
  birthday: string; // 出生日期（YYYY-MM-DD）
  nativePlace: string; // 籍贯
  nation: string; // 民族
  idCard: string; // 身份证号
  politics: string; // 政治面貌
  socialCard: string; // 社保卡号
  marriage: string; // 婚姻状况
  eduLevel: string; // 文化程度
  education: string; // 学历
  resident: string; // 户籍
  address: string; // 居住地址
  health: ElderlyHealth; // 健康信息
  selfCares: ElderlySelfCare[]; // 自理能力评估列表
  checkups: ElderlyCheckup[]; // 体检报告列表
  family: ElderlyFamily[]; // 家属信息列表
}

export interface IllnessItem {
    id: number; // 行唯一标识
    name: string; // 体检项目名称
    picture: string; // 上传的图片地址（新增该字段，用于双向绑定）
    val: string;
    // 其他原有字段...
}

/**
 * 疾病列表返回数据类型（顶层结构）
 */
export interface IllnessListResponse {
  list: IllnessItem[]; // 疾病列表数组
}

export interface BuildingType {
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
}

export interface BuildingItem {
  /** 唯一标识 ID */
  id: number;
  /** 公司 ID */
  companyId: number;
  /** 名称（楼栋名/单元名/楼层名） */
  name: string;
  /** 添加时间 */
  addTime: string;
  /** 添加人账户 ID */
  addAccountId: number;
  /** 父级 ID（pid=0 表示顶级节点，如楼栋；pid>0 表示子节点，如单元/楼层） */
  pid: number;
}

// 定义完整的返回数据格式（包含总条数和列表）
export interface BuildingResponse {
  /** 数据总条数 */
  counts: number;
  /** 楼栋/单元/楼层列表数组 */
  list: BuildingItem[];
}

// 定义单个表单项的接口
export interface FormItem {
  id: number;
  name: string;
  fileName:string
}

// 定义包含表单列表的根接口
export interface FormListResponse {
  list: FormItem[];
}

export interface FileItemDetail {
  elderlyId: number; // 老人ID
  fileName: string; // 文件路径/名称
  id: number; // 项ID
  name: string; // 项目名称（如“老人体检表”）
}

export interface RuleForm {
  id: number
  name: string
  pid: number
}