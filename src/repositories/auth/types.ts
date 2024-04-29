/** @format */

import { UserDocument } from "@/models";

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginData = {
  refreshToken: string | undefined;
  accessToken: string | undefined;
};

export type ForgotParams = {
  email: string;
};

export type ForgotData = {
  user: UserDocument;
  token: string;
};

export type ResetParams = {
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
};

export type ResetData = void;
