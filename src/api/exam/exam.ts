import http from "../../utile/request";
import type {
  PermissionItem,
  PermissionResponseData,
  RoleResponse,
  RoleType,
} from "./examType";

export const getRoleList = (params: RoleType) =>
  http.get<RoleResponse>("/api/role/list", params);

export const MenuList = () =>
  http.get<PermissionResponseData>("/api/menu/list");
