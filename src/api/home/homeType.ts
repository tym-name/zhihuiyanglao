export interface homeType {
  bedCounts: number;
  companyCounts: number;
  elderlyCounts: number;
}

interface MonthStat {
  // 统计数量，数值类型
  count: number;
  // 月份名称，字符串类型（格式如：2025年03月）
  name: string;
}

/**
 * 月份统计数据数组类型（直接基于 MonthStat 接口）
 */
export type MonthStatList = MonthStat[];

/**
 * 年龄段统计数据模型接口
 */
interface AgeGroupStat {
  name: "60以下" | "60-70" | "70-80" | "90以上";
  // 该年龄段的数量，数值类型
  count: number;
  // 年龄段名称，字符串类型（格式如：60 以下、60-70 等）
  ageGroup: string;
}

/**
 * 年龄段统计数据数组类型（基于单条数据接口）
 */

export type AgeGroupStatList = AgeGroupStat[];

interface Location {
    count: number;             // 强制指定为数字类型
    lngLat: string;            // 强制指定为字符串类型
    name: string;              // 强制指定为字符串类型
}

export type LocationList = Location[];

export interface Elderly{
  count:number
  name:string
}

export type ElderlyList = Elderly[];

