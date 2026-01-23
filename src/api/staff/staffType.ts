export interface staffRoles {
    id: number;
    name: string;
    companyId: number;
    addAccountId: number;
    addAccountName: null;
    addTime: string;
    accountCounts: number;
    menuIds: null;
};

export interface staffList {
    id: number;
    companyId: number;
    photo: string;
    name: string;
    mobile: string;
    isCarer: number;
    departmentId: number;
    addAccountId: number;
    addAccountName: string;
    addTime: string;
    departmentName: string;
    roles: Array<staffRoles>;
    adminId: number;
    adminUserName: string;
    adminPwd: string;
    enable: string;
    idCard: string;

};

export interface staffData {
    counts: number;
    pageSize: number;
    list: Array<staffList>;
};
// 编辑
export interface staffUpdateRoles {
    id: number;
    name: string;
    companyId: number;
    addAccountId: number;
    addAccountName: null;
    addTime: string;
    accountCounts: number;
    menuIds: null;
};

export interface staffUpdateData {
    id: number;
    companyId: number;
    photo: string;
    name: string;
    mobile: string;
    isCarer: number;
    addAccountId: number;
    addAccountName: string;
    addTime: string;
    departmentName: string;
    roles: Array<staffRoles>;
    adminId: number;
    adminUserName: string;
    adminPwd: string;
    enable: number;
    idCard: string;
    roleId: Array<string | number>;
    departmentId: string;

};
// 
export interface staffAddRoles {
    id: number;
};
export interface staffAddResult {
    id: number;
    photo: string;
    name: string;
    mobile: string;
    isCarer: number;
    departmentId: number;
    departmentName: string;
    roles: Array<staffAddRoles>;
    adminUserName: string;
    adminPwd: string;
    enable: number;
    idCard: string;
};
