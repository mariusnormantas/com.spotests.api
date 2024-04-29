/** @format */

import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";

// Making sure that session secret key exists.
const sessionDomain = process.env.SESSION_DOMAIN;
const sessionSecret = process.env.SESSION_SECRET;
const serverEnvironment = process.env.SERVER_ENVIRONMENT;
const cookieMaxAge = process.env.SESSION_COOKIE_MAX_AGE;

export const sessionConfig = () => {
  if (!sessionSecret || !sessionDomain) {
    return (req: Request, res: Response, next: NextFunction) => next();
  }
  return session({
    name: "sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      maxAge: cookieMaxAge ? parseInt(cookieMaxAge) : 0,
      domain: sessionDomain,
      secure: Boolean(serverEnvironment === "production"),
    },
  });
};
