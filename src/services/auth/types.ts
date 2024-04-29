/** @format */

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginData = {
  refreshToken?: string;
  accessToken?: string;
};

export type RefreshParams = {
  refreshToken: string;
};

export type RefreshData = {
  accessToken?: string;
};

export type ForgotParams = {
  email: string;
};

export type ForgotData = void;

export type ResetParams = {
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
};

export type ResetData = void;
