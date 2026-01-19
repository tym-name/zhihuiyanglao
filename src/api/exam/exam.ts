import http from "../../utils/request";
import type {
  PermissionResponseData,
  RoleResponse,
  RoleType,
} from "./examType";

export const getRoleList = (params: RoleType) =>
  http.get<RoleResponse>("/role/list", params);

export const MenuList = () =>
  http.get<PermissionResponseData>("/menu/list");
