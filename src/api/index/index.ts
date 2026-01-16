import http from '../../utils/request';
import type { CaptchaData, LoginPayload, LoginResponse, MenuList } from '../index/indexType'

/**
 * 获取图形验证码
 */

export const getCaptcha = () => http.get<CaptchaData>("/auth/getCaptcha");

/**
 * 获取公钥
 * 
 */
export const getPublicKey = () => http.get<string>('/auth/publicKey')

/**
 * 登录
 * 
 */
export const login = (data: LoginPayload) => http.post<LoginResponse>('/auth/login', data)

/**
 * 权限列表
 * 
 */
export const menu = () => http.get<MenuList>('/menu/list')

