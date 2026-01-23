// // 药品配送记录类型定义
// export interface MedicationDeliveryRecord {
//   // 基础信息
//   id: number;
//   companyId: number;
//   elderlyId: number;
//   addTime: string;

//   // 家属信息
//   familyName: string | null;

//   // 药品信息
//   name: string | null;
//   counts: number;
//   unit: string | null;
//   expTime: string | null;
//   sum: number;
//   norms: string | null;
//   remarks: string | null;

//   // 操作信息
//   addAccountId: number;
//   begId: number;
//   begName: string;
//   idCard: string | null;
//   addAccountName: string;

//   // 老人信息
//   elderlyName: string;
//   elderlyPhoto: string;
//   elderlyGender: string; // "0": 女, "1": 男
//   elderlyIdCard: string;

//   // 居住信息
//   houseName: string;
//   buildingName: string;

//   // 时间信息
//   startDate: string | null;
//   endDate: string | null;

//   // 计划信息
//   plans: any | null;
// }

// // 药品配送记录列表响应类型
// export interface MedicationDeliveryResponse {
//   counts: number;
//   pageSize: number;
//   list: MedicationDeliveryRecord[];
// }

// // 使用示例
// // const exampleData: MedicationDeliveryResponse = {
// //   counts: 5,
// //   pageSize: 10,
// //   list: [
// //     {
// //       id: 1797,
// //       companyId: 1979,
// //       elderlyId: 1715,
// //       addTime: "2026-01-12 08:54:34",
// //       familyName: "张三",
// //       name: null,
// //       counts: 1,
// //       unit: null,
// //       expTime: null,
// //       sum: 0,
// //       norms: null,
// //       remarks: null,
// //       addAccountId: 0,
// //       begId: 0,
// //       begName: "1号床",
// //       idCard: null,
// //       addAccountName: "李四",
// //       elderlyName: "张大爷",
// //       elderlyPhoto: "upload/2025/11/20/20251120222501662.jpeg",
// //       elderlyGender: "1",
// //       elderlyIdCard: "1111111111111111111111111",
// //       houseName: "103",
// //       buildingName: "四号楼一单元",
// //       startDate: null,
// //       endDate: null,
// //       plans: null
// //     }
// //     // ... 其他记录
// //   ]
// // };

/**
 * 存药登记列表参数
 */
export interface MedicineLogsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  beginDate?: string;
  endDate?: string;
  begId?: string;
}

/**
 * 存药登记列表返回参数
 */
export interface MedicineLogsList {
  counts: number;
  pageSize: number;
  list: ListItem[];
}

export interface ListItem {
  id: number;
  companyId: number;
  elderlyId: number;
  addTime: string;
  familyName: string;
  name: string | null;
  counts: number;
  unit: string | null;
  expTime: string | null;
  sum: number;
  norms: string | null;
  remarks: string | null;
  addAccountId: number;
  begId: number;
  begName: string;
  idCard: string | null;
  addAccountName: string;
  elderlyName: string;
  elderlyPhoto: string;
  elderlyGender: string;
  elderlyIdCard: string;
  houseName: string;
  buildingName: string;
  startDate: string | null;
  endDate: string | null;
  plans: any | null; // 根据实际数据类型调整
}

/**
 * 存药添加登记 请求参数
 */
export interface AddMedicineLogsParams {
  elderlyId?: number;
  addTime?: string; // 格式: "YYYY-MM-DD HH:mm:ss"
  familyName?: string;
  name?: string;
  counts?: number;
  unit?: string;
  expTime?: string; // 格式: "YYYY-MM-DD"
  sum?: number;
  norms?: string;
  remarks?: string;
  dialogVisible?: boolean;
  id: 0;
  tableData?: tableData[];
}

export interface tableData {
  id?: number;
  name?: string;
  counts?: number;
  unit?: string;
  expTime?: string; // 格式: "YYYY-MM-DD"
  sum?: number;
  norms?: string;
  remarks?: string;
}

/**
 * 用药登记添加单个药品请求参数
 */
export interface DrugAddParams {
  id?: number;
  elderlyId: number;
  addTime: string; // 格式: "YYYY-MM-DD HH:mm:ss"
  familyName: string;
  name: string;
  counts: number;
  unit: string;
  expTime: string; // 格式: "YYYY-MM-DD"
  sum: number;
  norms: string;
  remarks: string;
}

/**
 * 根据id  获取单条详情数据
 */

export interface MedicationRecord {
  id: number;
  companyId: number;
  elderlyId: number;
  addTime: string; // 格式: "YYYY-MM-DD HH:mm:ss"
  familyName: string;
  name: string;
  counts: number;
  unit: string;
  expTime: string; // 格式: "YYYY-MM-DD"
  sum: number;
  norms: string;
  remarks: string | null;
  addAccountId: number;
  begId: number;
  begName: string | null;
  idCard: string | null;
  addAccountName: string | null;
  elderlyName: string | null;
  elderlyPhoto: string | null;
  elderlyGender: string | null;
  elderlyIdCard: string | null;
  houseName: string | null;
  buildingName: string | null;
  startDate: string | null;
  endDate: string | null;
  plans: any | null;
}

/**
 * 根据id获取存药记录
 */

export interface MedicineResponse {
  list?: MedicineRecordDate[];
}

export interface MedicineRecordDate {
  id: number;
  companyId: number;
  elderlyId: number;
  addTime: string;
  familyName: string;
  name: string;
  counts: number;
  unit: string;
  expTime: string;
  sum: number;
  norms: string;
  remarks: string;
  addAccountId: number;
  begId: number;
  begName: string | null;
  idCard: string | null;
  addAccountName: string;
  elderlyName: string | null;
  elderlyPhoto: string | null;
  elderlyGender: string | null;
  elderlyIdCard: string | null;
  houseName: string | null;
  buildingName: string | null;
  startDate: string | null;
  endDate: string | null;
  plans: any | null; // 根据实际类型可以更具体地定义
}

/**
 * 用药计划的设置
 */
export interface Plan {
  id?: number;
  endDate?: string;
}

/**
 * 用药记录列表
 */

export interface MedicinePlansetResponse {
  list: MedicineRecordPlanset[];
}

interface MedicinePlan {
  // 根据实际 plans 数据结构定义
  // 示例：如果 plans 是数组对象，可以这样定义
  planId?: number;
  planTime?: string; // 服药时间
  planDosage?: number; // 剂量
  planFrequency?: string; // 频次，如 "每日三次"
  // ... 其他计划相关字段
}

export interface MedicineRecordPlanset {
  id: number;
  companyId: number;
  elderlyId: number;
  addTime: string; // 添加时间
  familyName: string; // 家属姓名
  name: string; // 药品名称
  counts: number; // 数量
  unit: string; // 单位
  expTime: string; // 有效期
  sum: number; // 总剂量
  norms: string; // 规格/剂型
  remarks: string; // 备注
  addAccountId: number; // 添加人ID
  begId: number; // 床位ID
  begName: string | null; // 床位名称
  idCard: string | null; // 身份证号
  addAccountName: string; // 添加人姓名
  elderlyName: string | null; // 老人姓名
  elderlyPhoto: string | null; // 老人照片
  elderlyGender: string | null; // 老人性别
  elderlyIdCard: string | null; // 老人身份证号
  houseName: string | null; // 楼栋名称
  buildingName: string | null; // 建筑名称
  startDate: string | null; // 开始日期
  endDate: string | null; // 结束日期
  plans: MedicinePlan[]; // 服药计划数组
}

/**
 * 用药记录的添加参数
 */

export interface MedicationInfo {
  drugId?: number;
  startDate?: string; // 日期格式如 "YYYY-MM-DD"
  plans: MedicationPlan[];
}

export interface MedicationPlan {
  time?: string; // 时间格式如 "HH:mm:ss"
  content?: string; // 用药说明
}
