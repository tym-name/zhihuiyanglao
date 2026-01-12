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

  export interface RolePermission {
  /** 角色/用户ID */
  id: number;
  /** 角色/用户名称 */
  name: string;
  /** 关联的菜单ID列表（注意：原始数据中19.20是笔误，应为19,20） */
  menuIds: number[];
}

export interface MenuItem {
  id: number;
  name: string;
  icon: string | null;
  url: string | null;
  pathName: string | null;
  pid: number;
  sort: number;
  type: number;
  isButton: number;
  children: MenuItem[];
}

export interface RoleListData {
list: MenuItem[];
}
