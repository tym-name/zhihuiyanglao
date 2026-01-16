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
    begName: null;
    elderlyName: null;
    elderlyPhoto: null;
    elderlyGender: null;
    elderlyIdCard: null;
    houseName: null;
    buildingName: string;
    pictures: Array<clothesPictures>;
};

export interface clothesData {
    counts: number;
    pageSize: number;
    list: Array<ClothesList>;
};
// 
