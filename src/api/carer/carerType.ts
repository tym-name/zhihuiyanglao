export interface roleListFunList {
    id: number;
    name: string;
    companyId: number;
    addAccountId: number;
    addAccountName: string;
    addTime: string;
    accountCounts: number;
    menuIds: null;
};

export interface roleListData {
    counts: number;
    pageSize: number;
    list: Array<roleListFunList>;
};