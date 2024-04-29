/** @format */

import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "@/session";
import { ErrorResponse } from "@/utils";

export class AccessMiddleware {
  protected req;
  protected res;
  protected next;
  protected user;

  /**
   * Constructor method for initializing a new instance of the class.
   */
  public constructor(
    req: AuthorizedRequest,
    res: Response,
    next: NextFunction
  ) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.user = req.user;
  }

  /**
   * Middleware's method, which determines, what type of user is requesting data.
   */
  public async determineApplicant() {
    switch (this.user?.role) {
      case "admin":
        await this.adminAccessingEntity();
        break;
      case "organization":
        await this.organizationAccessingEntity();
        break;
      case "trainer":
        await this.trainerAccessingEntity();
        break;
      case "athlete":
        await this.athleteAccessingEntity();
        break;
      default:
        throw this.notAllowedException();
        break;
    }
  }

  /**
   * Middleware's method, which runs, when admin is requesting data.
   */
  protected async adminAccessingEntity() {}

  /**
   * Middleware's method, which runs, when admin is requesting data.
   */
  protected async organizationAccessingEntity() {}

  /**
   * Middleware's method, which runs, when trainer is requesting data.
   */
  protected async trainerAccessingEntity() {}

  /**
   * Middleware's method, which runs, when athlete is requesting data.
   */
  protected async athleteAccessingEntity() {}

  /**
   * Method, which throws exception's error, when request is not allowed.
   */
  protected notAllowedException() {
    return new ErrorResponse({
      status: 405,
      message: "You do not have the rights to perform these actions",
    });
  }
}
