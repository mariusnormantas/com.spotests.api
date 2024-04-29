/** @format */

import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  verifiedAt: Date;
  password: string;
  role: UserRole;
  locked: boolean;
  reset: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserMethods = {
  comparePasswords(password: string): Promise<boolean>;
  signRefreshToken(): string | undefined;
  signAccessToken(): string | undefined;
};

export interface UserModel
  extends mongoose.Model<UserDocument, {}, UserMethods> {
  generatePassword: () => Promise<string>;
}

export type UserRole = "admin" | "organization" | "trainer" | "athlete";

export interface RefreshTokenPayload extends jwt.JwtPayload {
  _id: mongoose.Types.ObjectId;
}

export interface AccessTokenPayload extends jwt.JwtPayload {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
}
