/** @format */

import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { ErrorResponse } from "@/utils";
import { AccessTokenPayload } from "@/models";
import { AuthorizedRequest } from "@/session";

/**
 * Middleware, which access token validation.
 * @param req AuthorizedRequest
 * @param res Response
 * @param next NextFunction
 */
export async function AccessTokenMiddleware(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  // Defines authorization's header.
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const xUser = req.headers["x-user"] || req.headers["X-User"];

  // Checks if type of user is string and valid.
  if (typeof xUser !== "string") {
    throw new ErrorResponse({ status: 401, message: "Unauthorized" });
  }

  // Checks, if authorization's header is correct type and starts with Bearer.
  if (
    !authHeader ||
    typeof authHeader !== "string" ||
    !authHeader.startsWith("Bearer ")
  ) {
    throw new ErrorResponse({ status: 401, message: "Unauthorized" });
  }

  // Extracts access token from authorization's header.
  const accessToken = authHeader.split(" ")[1];

  // Checks, if access token's secret exists.
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    throw new ErrorResponse();
  }

  jwt.verify(accessToken, accessTokenSecret, (error, decoded) => {
    if (error) {
      throw new ErrorResponse({ status: 403, message: "Forbidden" });
    }
    const payload = decoded as AccessTokenPayload;
    const reqXUser = xUser as unknown;
    // Checks if payload in token user's ID match with request's author's ID.
    if (payload._id !== reqXUser) {
      throw new ErrorResponse({ status: 403, message: "Forbidden" });
    }
    req.user = decoded as AccessTokenPayload;
  });

  next();
}
