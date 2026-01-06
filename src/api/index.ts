import http from '../utile/request';
import type { CaptchaData, LoginPayload, LoginResponse } from './indexType'

/**
 * 获取图形验证码
 */

export const getCaptcha = () => http.get<CaptchaData>("/api/auth/getCaptcha");

/**
 * 获取公钥
 * 
 */
export const getPublicKey = () => http.get<string>('/api/auth/publicKey')

/**
 * 登录
 * 
 */
export const login = (data: LoginPayload) => http.post<LoginResponse>('/api/auth/login', data)

