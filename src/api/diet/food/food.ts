import http from "../../../utile/request";
import type {
  FoodListResponse,
  foodListType,
  FoodPriceListData,
  FoodPriceResponse,
  FoodPriceType,
  FoodsAddData,
  FoodsAddType,
  supplierListType,
  SupplierResponseData,
} from "./foodType";

/**
 * 食材管理列表
 */

export const foodList = (params: foodListType) =>
  http.get<FoodListResponse>("/api/foods/list", params);

/**
 * 供应商列表
 */
export const supplierList = (params: supplierListType) =>
  http.get<SupplierResponseData>("/api/supplier/list", params);

/**
 * 食材添加

 */
export const addFoods = (data: FoodsAddType) =>
  http.post<FoodsAddData>("/api/foods/add", data);

/**
 * 修改食品价格
 */

export const updateFoodPrice = (data: FoodPriceType) =>
  http.put<FoodPriceResponse>("/api/foodprice/update", data);

/**
 * 根据食材id获取价格列表
 */
export const FoodPriceList = (id: number) =>
  http.get<FoodPriceListData>(`/api/foodprice/list/${id}`);

/**
 * 修改食材
 */
export const updateFood = (data: FoodsAddType) =>
  http.put<FoodsAddData>("/api/foods/update", data);

/**
 * 删除食材
 */
export const deleteFood = (id: number) =>
  http.delete(`/api/foods/delete/${id}`);

/**
 * 批量删除
 */
export const delAllFood = (ids: number[]) =>
  http.post("/api/foods/deleteAll", ids);
