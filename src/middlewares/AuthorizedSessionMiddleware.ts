/** @format */

import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "@/session";

/**
 * Middleware, which handles authorized session.
 * @param req AuthorizedRequest
 * @param res Response
 * @param next NextFunction
 */
export async function AuthorizedSessionMiddleware(
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
) {
  // Session's cookie options to correctly remove it.
  const cookieOptions = {
    httpOnly: true,
    domain: process.env.SESSION_DOMAIN,
    secure: process.env.SERVER_ENVIRONMENT === "production",
  };

  // Checks, if userId do not exist on session, then we should clear the cookie.
  if (!req.session.refreshToken) {
    res.clearCookie("sid", cookieOptions);
  }
  next();
}
