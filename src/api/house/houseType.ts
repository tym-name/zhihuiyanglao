export interface PageQueryParams {
  // page 是字符串类型（对应 JSON 中的 "1"）
  page?: number;
  // pageSize 是数字类型（对应 JSON 中的 1）
  pageSize?: number;
  // staffName 是字符串类型（对应 JSON 中的空字符串 ""）
  name?: string;
  // id 是 null 或 undefined（对应 JSON 中的 null，可选且允许为 null）
  buildingId?: number | null;
  // 补充：如果 id 后续可能有其他类型（如数字/字符串），可扩展为：id: number | string | null | undefined;
}

// 定义接口，匹配所有字段的类型和含义
export interface RoomInfo {
  // 新增账户ID，数字类型
  addAccountId: number;
  // 新增账户名称，字符串类型（带引号的文本）
  addAccountName: string;
  // 新增时间，字符串类型（时间格式文本）
  addTime: string;
  // 床位数，数字类型
  beds: number;
  // 楼栋ID，数字类型
  buildingId: number;
  // 楼栋名称，字符串类型
  buildingName: string;
  // 公司ID，数字类型
  companyId: number;
  // 主键ID，数字类型
  id: number;
  // 房间名称，字符串类型
  name: string;
  // 图片路径，字符串类型（文件上传路径）
  picture: string;
  // 房间类型编码，数字类型
  type: number;
  // 房间类型名称，字符串类型
  typeName: string;
}

export interface RoomInfoList {
  // 列表数据，数组类型
  list: RoomInfo[];
  // 总数，数字类型
  counts: number;
}

// 定义接口，命名贴合数据语义（如 BuildingInfo 表示楼宇信息）
export interface BuildingInfo {
  // 主键ID，数字类型（对应 JSON 中的 0）
  id: number;
  // 楼栋ID，数字类型（对应 JSON 中的 550）
  buildingId: number;
  typeName:string
  // 类型编码，数字类型（对应 JSON 中的 2）
  type: number;
  // 楼宇名称，字符串类型（对应 JSON 中的 "1号楼"）
  name: string;
  // 床位数，数字类型（对应 JSON 中的 10）
  beds: number | null;
  // 图片路径，字符串类型（对应 JSON 中的文件上传路径）
  picture: string;
}