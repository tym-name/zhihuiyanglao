export interface CaptchaData {
  imageCode: string
  id: string
}

export interface RuleForm {
    username: string;
    pwd: string;
    verifyCode: string;
    verifyCodeId: string;
}

export interface LoginPayload {
  username: string
  pwd: string
  verifyCode: string
  verifyCodeId: string
}


export interface LoginResponse {
  refreshToken: string;
  token: string;
  model?: any; // 登录接口返回的model数据
  loginLog?:any
}

export interface MenuList{
  list:MenuItem[]
}
export interface MenuItem {
  id: number;           // 菜单ID
  name: string;        // 菜单名称
  icon: string | null; // 图标（可能为null）
  url: string;  // 路由地址（可能为null）
  pathName: string | null; // 路径名称（可能为null）
  pid: number;         // 父级菜单ID（0表示顶级菜单）
  sort: number;        // 排序序号
  type: number;        // 类型标识
  isButton: number;    // 是否为按钮权限（1是，0否）
  children:MenuItem[]
}

export interface UpdatePwd { 
  pwd:string
  newPwd:string
  confirmPwd:string
}

export interface WechatUserInfo {
  country?: string;
  unionid?: string;
  province?: string;
  city?: string;
  openid?: string;
  sex?: number; // 0-未知, 1-男性, 2-女性
  nickname?: string;
  headimgurl?: string;
  language?: string;
  privilege?: any[]; // 根据实际情况定义具体类型
}

export interface LoginWeChat {
  username: string
  pwd: string
  openId: string
}

export interface AccountItem {
  id: number;
  companyId: number;
  level: number;
  staffId: number;
  name: string;
  pwd: string;
  newPwd: string | null;
  type: number;
  enable: number;
  photo: string;
  mobile: string;
  username: string;
  roleIds: string | null;
  outLogs: string | null;
  verifyCode: string | null;
  verifyCodeId: string | null;
  openId: string | null;
}

export interface WeChatLoginResponse {
  model: AccountItem;
  token: string;
  refreshToken: string;
}

export interface wechatInfo {
  code:string
}