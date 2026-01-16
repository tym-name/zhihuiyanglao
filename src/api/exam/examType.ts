interface RoleItem {
  id: number;
  name: string;
  companyId: number;
  addAccountId: number;
  addAccountName: string;
  addTime: string;
  accountCounts: number;
  menuIds: number[] | null;
}

/**
 * 整体返回数据的类型定义
 */
export interface RoleResponse {
  counts: number;
  pageSize: number;
  list: RoleItem[];
}

export interface RoleType {
  page: number;
  pageSize: number;
}

export interface PermissionItem {
  /** 权限唯一标识 ID */
  id: number;
  /** 权限名称（如"添加地址"、"养老护理"） */
  name: string;
  /** 权限图标（可能为 null/字符串） */
  icon: string | null;
  /** 权限对应的 URL 路径（可能为 null/字符串） */
  url: string | null;
  /** 路由路径名称（可能为 null/字符串） */
  pathName: string | null;
  /** 父级权限 ID（0 表示根节点） */
  pid: number;
  /** 排序序号 */
  sort: number;
  /** 权限类型（固定值 3，可根据实际扩展为联合类型） */
  type: number;
  /** 是否为按钮权限（1=是，0=否） */
  isButton: 0 | 1; // 使用字面量类型更精准，限制只能是 0 或 1
}

export interface TreePermissionNode extends PermissionItem {
  children?: TreePermissionNode[];
}

export interface PermissionResponseData {
  /** 权限列表 */
  list: PermissionItem[];
}
