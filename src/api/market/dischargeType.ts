export interface dischargeList {
    id: number;
    companyId: number;
    elderlyId: number;
    expectDate: string;
    reason: string;
    state: number;
    addTime: string;
    addAccountId: number;
    begId: number;
    begName: string;
    addAccountName: string;
    elderlyName: string;
    elderlyPhoto: string;
    elderlyGender: string;
    elderlyIdCard: string;
    houseName: string;
    buildingName: string;
};

export interface dischargeData {
    counts: number;
    pageSize: number;
    list: Array<dischargeList>;
};