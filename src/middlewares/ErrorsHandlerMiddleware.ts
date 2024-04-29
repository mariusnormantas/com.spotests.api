/** @format */

import { ErrorResponse } from "@/utils";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware, which handles errors occurred on requests.
 * @param err Error
 * @param req AuthorizedRequest
 * @param res Response
 * @param next NextFunction
 */
export function ErrorsHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Checks, if error is instance of custom error class.
  if (err instanceof ErrorResponse) {
    res.status(err.status ?? 500).json({
      status: err.status ?? 500,
      message: err.message ?? "Unexpected Error Occurred",
      success: false,
    });
  }
  // Regular request's error.
  else if (err) {
    res.status(500).json({
      status: 500,
      message: "Unexpected Error Occurred",
      success: false,
    });
  }
  next();
}
