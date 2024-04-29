/** @format */

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as type from "./types";

/**
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 */
const UserSchema = new mongoose.Schema<
  type.UserDocument,
  type.UserModel,
  type.UserMethods
>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 64,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "organization", "trainer", "athlete"],
      required: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
      nullable: true,
    },
    reset: {
      type: String,
      default: null,
      nullable: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 */
UserSchema.static("generatePassword", async function (): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(Math.random().toString(36).slice(-8), salt);
});

/**
 * To define an instance method in TypeScript, create a new interface representing your instance methods. You need to pass that interface as the 3rd generic parameter to the Schema constructor and as the 3rd generic parameter to Model as shown below.
 */
UserSchema.method("comparePasswords", async function (password: string) {
  return await bcrypt.compare(password, this.password);
});

UserSchema.method("signRefreshToken", function (): string | undefined {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshTokenExpire = process.env.REFRESH_TOKEN_EXPIRE;
  if (!refreshTokenSecret) return undefined;
  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpire,
    }
  );
});

UserSchema.method("signAccessToken", function (): string | undefined {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpire = process.env.ACCESS_TOKEN_EXPIRE;
  if (!accessTokenSecret) return undefined;
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpire,
    }
  );
});

/**
 * Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins.
 */
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export const User = mongoose.model<type.UserDocument, type.UserModel>(
  "User",
  UserSchema
);
