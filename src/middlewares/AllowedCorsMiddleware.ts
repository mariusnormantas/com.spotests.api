/** @format */

import { NextFunction, Request, Response } from "express";
import { allowedOrigins } from "@/config";

/**
 * Middleware, which handles allowed origins headers.
 * @param req AuthorizedRequest
 * @param res Response
 * @param next NextFunction
 */
export const AllowedCorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};
