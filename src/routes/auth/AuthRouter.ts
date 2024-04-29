/** @format */

import { Request } from "express";
import rateLimit from "express-rate-limit";
import { AuthController } from "@/controllers";
import Router from "../Router";
import * as schema from "./schemas";

export class AuthRouter extends Router {
  /**
   * Method, which initializes router's endpoints when instance is created.
   */
  protected init() {
    this.Routes.get("/v1/status", AuthController.status);
    this.Routes.post("/v1/logout", AuthController.logout);
    this.Routes.get("/v1/refresh", AuthController.refresh);
    this.Routes.post(
      "/v1/login",
      this.authRateLimit(),
      schema.LoginSchema,
      this.validate,
      AuthController.login
    );
    this.Routes.post(
      "/v1/forgot",
      this.authRateLimit(),
      schema.ForgotSchema,
      this.validate,
      AuthController.forgot
    );
    this.Routes.post(
      "/v1/reset/:token",
      this.authRateLimit(),
      schema.ResetSchema,
      this.validate,
      AuthController.reset
    );
  }

  /**
   * Method, which handles authentication's rate limitter for specific routes, which allows 3 requests per minute per IP.
   */
  private authRateLimit() {
    return rateLimit({
      windowMs: 60 * 1000,
      max: 3,
      message: {
        status: 429,
        message: "Too many request attempts",
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: Request) => `${req.ip}-${req.get("User-Agent")}`,
    });
  }
}
