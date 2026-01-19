export interface roleList {
    id: number;
    name: string;
    companyId: number;
    addAccountId: number;
    addAccountName: string;
    addTime: string;
    accountCounts: number;
    menuIds?: number[];
};

export interface roleData {
    counts: number;
    pageSize: number;
    list: Array<roleList>;
};
// 
export interface getListForUserList {
    id: number;
    name: string;
    icon: null;
    url: null;
    pathName: null;
    pid: number;
    sort: number;
    type: number;
    isButton: number;
};

export interface getListForUserData {
    list: Array<getListForUserList>;
};
// 添加
export interface roleAddData {
    id: number;
    name: string;
    companyId: number;
    addAccountId: number;
    addAccountName: string | null;  // 修改为可空字符串
    addTime: string;
    accountCounts: number;
    menuIds: Array<number>;
};
export interface roleDetailData {
    id: number;
    name: string;
    companyId: number;
    addAccountId: number;
    addAccountName: string | null;
    addTime: string;
    accountCounts: number;
    menuIds: number[]; // 这里应该是数组
};