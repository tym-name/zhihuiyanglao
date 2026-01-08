export interface AccountType {
    page?: number; // 当前页码
    pageSize?: number; // 每页条数
}
export interface AccountData {
    counts: number;
    pageSize: number;
    list: Array<AccountResult>;
};

export interface AccountResult {
    id: number;
    companyId: number;
    level: number;
    staffId: number;
    name: string;
    pwd: string;
    newPwd: null;
    type: number;
    enable: number;
    photo: string;
    mobile: string;
    username: string;
    roleIds: null;
    outLogs: null;
    verifyCode: null;
    verifyCodeId: null;
    openId: null;
};
// 所属角色

export interface role {
    counts: number;
    pageSize: number;
    list: Array<roleData>;
};
export interface roleData {
    id: number;
    name: string;
    companyId: number;
    addAccountId: number;
    addAccountName: null;
    addTime: string;
    accountCounts: number;
    menuIds: null;
};