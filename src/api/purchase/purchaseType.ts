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
    list: Array<purchaseParam>;
};

export interface purchaseParams {
    pageSize: number
    page: number
    companyId: string
    state: string
    beginDate: string
    endDate: string
    id?: number;
}
// 根据采购id获取采购物品列表
export interface PurchaseFoodItem {
    id: number;
    purchaseId: number;
    foodName: string;
    unit: string;
    supplierId: number;
    wholePrice: number;
    sellPrice: number;
    purchasePrice: number;
    purchaseCounts: number;
    receiveCounts: number;
    supplierName: null;
};

interface purchaseFoodsData {
    list: Array<PurchaseFoodItem>;
};