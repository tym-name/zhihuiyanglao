export interface HomeType {
  name?: string; // 机构名称
  adminName?: string; // 管理员姓名
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
}

// 机构数据项类型
export interface InstitutionItem {
  id: number;                    // 机构ID
  pid: number;                   // 父级ID
  name: string;                  // 机构名称
  address: string;               // 详细地址
  province: string;             // 省份
  city: string;                 // 城市
  telephone: string;            // 联系电话
  startTime: string;            // 开始时间
  legalPerson: string;          // 法人代表
  mobile: string;               // 手机号
  creditCode: string;           // 信用代码
  license: number;              // 许可证
  medicalPoint: number;         // 医疗点数
  house: string;                // 房屋类型
  certificate: string;          // 证书图片路径
  picture: string;              // 机构图片路径
  addAccountId: number;         // 添加账号ID
  addAccountName: string;       // 添加账号名称
  addTime: string;              // 添加时间
  adminId: number;              // 管理员ID
  adminUserName: string;        // 管理员用户名
  adminPwd: string | null;      // 管理员密码（可能为空）
  adminName: string;            // 管理员姓名
  adminMobile: string;          // 管理员手机号
  enable: number;               // 启用状态（1启用，0禁用）
}

// 机构列表响应类型
export interface InstitutionListResponse {
  counts: number;               // 总记录数
  pageSize: number;             // 每页大小
  list: InstitutionItem[];      // 机构列表
}