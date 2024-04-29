/** @format */

import { AuthorizedRequest } from "@/session";
import express, { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import { ErrorResponse } from "@/utils";
import { AccessTokenMiddleware, RoleAccessMiddleware } from "@/middlewares";
import * as schema from "./schemas";

export default class Router {
  // Initializes class variables.
  public Routes: express.Router;
  public Admin: express.Router;
  protected schema = schema;

  /**
   * Constructor method for initializing a new instance of the class.
   */
  public constructor() {
    this.Routes = express.Router();
    this.Admin = express.Router();

    // Common router's middlewares.
    this.Routes.use([this.rateLimit]);
    this.Admin.use([
      AccessTokenMiddleware,
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next).roles(["admin"]).grant();
      },
    ]);

    // Initialization.
    this.init();
    this.admin();
  }

  /**
   * Method, which initializes router's endpoints when instance is created.
   */
  protected init() {}

  /**
   * Method, which initializes admin endpoints when instance is created.
   */
  protected admin() {}

  /**
   * Method, which handles default rate limitter for routes, which allows 100 requests per minute per IP.
   */
  protected rateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
      status: 429,
      message: "Too many request attempts",
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => `${req.ip}-${req.get("User-Agent")}`,
  });

  /**
   * Method, which validates route's schema.
   * @param req Request
   * @param res Response
   * @param next NextFunction
   */
  protected validate(req: Request, res: Response, next: NextFunction) {
    // Retrieves errors from validator.
    const error = validationResult(req).array({ onlyFirstError: true })[0];

    // Checks, if there is no error, then we just pass the validation.
    if (error) {
      const message = error.msg.message ?? error.msg;
      const status = error.msg.status;
      throw new ErrorResponse({ status, message });
    }
    next();
  }
}
