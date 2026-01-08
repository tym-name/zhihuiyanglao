export interface HomeType {
  name?: string; // 机构名称
  adminName?: string; // 管理员姓名
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
}

// 机构数据项类型
export interface InstitutionItem {
  cityInfo: { province: string; city: string; };
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

export interface ResetPasswordParams {
  id: number; // 账号ID
  newPassword: string; // 新密码
  confirmPassword?: string;
}

/** 机构/公司信息类型 */
export interface CompanyInfo {
  id: number | null;// 机构ID
  cityInfo: any;
  /** 机构名称 */
  name: string;
  /** 省份 */
  province: string;
  /** 城市 */
  city: string;
  /** 详细地址 */
  address: string;
  /** 固定电话（可为null） */
  telephone: string | null;
  /** 成立时间（可为null，建议用字符串格式 YYYY-MM-DD） */
  startTime: string | null;
  /** 法人（可为null） */
  legalPerson: string | null;
  /** 法人手机号（可为null） */
  mobile: string | null;
  /** 统一社会信用代码（可为null） */
  creditCode: string | null;
  /** 营业执照（0/1 布尔型数字，0=无，1=有） */
  license: 0 | 1;
  /** 医疗点位（0/1 布尔型数字） */
  medicalPoint: 0 | 1;
  /** 房屋相关信息（可为null） */
  house: string | null;
  /** 证书/资质文件路径（单张图片） */
  certificate: string;
  /** 多张图片路径（逗号分隔的字符串） */
  picture: string;
  /** 管理员账号 */
  adminUserName: string;
  /** 管理员密码 */
  adminPwd: string;
  /** 管理员姓名 */
  adminName: string;
  /** 管理员手机号 */
  adminMobile: string;
  // 可选：如果有id字段，补充以下定义
  // id?: number;
}