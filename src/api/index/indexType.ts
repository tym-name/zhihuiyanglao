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
  token: string
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