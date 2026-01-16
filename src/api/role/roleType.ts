export interface roleData {
  page?: number; // 当前页码
  pageSize?: number; // 每页条数
}

export interface ItemList {
  id: number;
  name: string;
  companyId: number;
  addAccountId: number;
  addAccountName: string;
  addTime: string;
  accountCounts: number;
  menuIds: null;
}

// 最外层的分页总数据类型
export interface PageData {
  counts: number;
  pageSize: number;
  list: ItemList[];
}

export interface MenuPermission {
  /** 主键ID */
  id: number;
  /** 名称（机构/角色名称） */
  name: string;
  /** 菜单ID列表 */
  menuIds: number[];
}

export interface MenuPermissionList {
  /** 菜单/按钮列表 */
  list: MenuItem[];
}

/**
 * 菜单/按钮项的具体类型
 */
export interface MenuItem {
  /** 菜单/按钮唯一标识ID */
  id: number;
  /** 菜单/按钮名称 */
  name: string;
  /** 菜单图标（可选，按钮一般为null/空字符串） */
  icon: string | null;
  /** 路由URL路径（可选，包含参数如 details/:id） */
  url: string | null;
  /** 路由组件名称（可选） */
  pathName: string | null;
  /** 父级ID，0表示顶级菜单 */
  pid: number;
  /** 排序序号 */
  sort: number;
  /** 类型标识（固定为3，业务特定） */
  type: number;
  /** 是否为按钮：1=是，0=否 */
  isButton: 0 | 1;
}