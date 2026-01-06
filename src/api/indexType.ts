export interface CaptchaData {
  imageCode: string
  id: string
}

export interface RuleForm {
  username: string;
  pwd: string;
  verifyCode: string;
  verifyCodeId: string;
}

export interface LoginPayload {
  username: string
  pwd: string
  verifyCode: string
  verifyCodeId: string
}

export interface LoginResponse {
  token: string
}