export interface ServiceData {
    page: number;
    pageSize: number;
}

export interface ServiceAddData {
    name: string,
    content: string
}

export interface ServiceUpdateData {
    id: number;
    name: string,
    content: string
}