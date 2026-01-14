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
// 添加账号
export interface accountAddData {
    id: number;
  username: string;
  pwd: string;
  name: string;
  enable: 0 | 1;
  photo: string;
  mobile: string;
  roleIds: number[];
};
// 添加账号头像
export interface uploadAddData {
    url: string;
};

export interface uploadAddResult {
    code: number;
    msg: string;
    data: uploadAddData;
};
// 重置密码
export interface resetPwdType {
    id: number;
    pwd: string;
    newPwd: string;
    name: string;
};