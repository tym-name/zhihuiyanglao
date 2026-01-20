export interface departmentList {
    id: number;
    companyId: number;
    name: string;
    pid: number;
};

export interface departmentData {
    counts: number;
    pageSize: number;
    list: Array<departmentList>;
};
