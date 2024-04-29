/** @format */

import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "@/session";
import { TestingController } from "@/controllers";
import {
  AccessAthleteMiddleware,
  AccessTokenMiddleware,
  RoleAccessMiddleware,
} from "@/middlewares";
import Router from "../Router";
import * as schema from "./schemas";

export class TestingRouter extends Router {
  /**
   * Method, which initializes router's endpoints when instance is created.
   */
  protected init() {
    this.Routes.use([AccessTokenMiddleware]);
    this.Routes.post(
      "/v1/create",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("testing", ["create"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.CreateSchema,
      this.validate,
      TestingController.create
    );
    this.Routes.get(
      "/v1/listing",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("testing", ["read-all"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      this.schema.PaginationSchema,
      this.validate,
      TestingController.listing
    );
    this.Routes.get(
      "/v1/summary",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("testing", ["read-all"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.SummarySchema,
      this.validate,
      TestingController.summary
    );
    this.Routes.delete(
      "/v1/:testingId/delete",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("testing", ["delete"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.DeleteSchema,
      this.validate,
      TestingController.delete
    );
  }
}
