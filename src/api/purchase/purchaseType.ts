export interface purchaseParam {
    id: number;
    companyId: number;
    receiveTime: string;
    addTime: string;
    addAccountId: number;
    picture: string;
    remarks: string;
    state: string;
    addAccountName: string;
    companyName: string;
    counts: number;
    purchasePrice: number;
    foods: null;
};

export interface purchaseData {
    counts: number;
    pageSize: number;
    list: Array<purchaseParams>;
};

export interface purchaseParams {
    pageSize: number
    page: number
    companyId: string
    state: string
    beginDate: string
    endDate: string
}