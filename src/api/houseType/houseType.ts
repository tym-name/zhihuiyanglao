export interface HouseType {
   page?: number; // 当前页码
  pageSize?: number; // 每页条数
}

export interface HouseList {
   companyId: number;
  id: number;
  name: string;
}

export interface HouseListResult {
   list: HouseList[];
   counts: number;
}

export interface House{
   name:string
   id:number
}