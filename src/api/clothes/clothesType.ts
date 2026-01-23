// 
interface clothesPictures {
    id: number;
    clotheId: number;
    file: string;
};

export interface ClothesList {
    id: number;
    companyId: number;
    elderlyId: number;
    title: string;
    content: string;
    type: string;
    state: string;
    addTime: string;
    addAccountId: number;
    addAccountName: string;
    begName: null | string;
    elderlyName: null | string;
    elderlyPhoto: null | string;
    elderlyGender: null | number;
    elderlyIdCard: null | string;
    houseName: null | string;
    buildingName: string;
    pictures: Array<clothesPictures>;
};

export interface clothesData {
    counts: number;
    pageSize: number;
    list: Array<ClothesList>;
};
// 
export interface ClothesQueryParams {
    page?: number
    limit?: number
    elderlyName?: string
    type?: string
    state?: string
    startTime?: string
    endTime?: string
}

// 
export interface uploadAddData {
    url: string;
};

export interface uploadAddResult {
    code: number;
    msg: string;
    data: uploadAddData;
};
