import http from '../../utils/request';
import type { CaptchaData, LoginPayload, LoginResponse, LoginWeChat, MenuList, UpdatePwd, wechatInfo, WeChatLoginResponse, WechatUserInfo } from '../index/indexType'

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

/**
 * 修改密码
 * 
 */
export const updatePwd = (data: UpdatePwd) => http.put('/account/updatePwd', data)

/**
 * 微信扫一扫登录
 * 
 */
export const wechatLogin = (params: wechatInfo) => http.get<WeChatLoginResponse | WechatUserInfo>('/auth/wechat',params)

/**
 * 用户登录并绑定微信
 * 
 */
export const loginBindWeChat = (data: LoginWeChat) => http.post<any>('/auth/loginBindWeChat', data);