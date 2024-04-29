/** @format */

import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "@/session";
import { AthleteController } from "@/controllers";
import {
  AccessTokenMiddleware,
  RoleAccessMiddleware,
  AccessAthleteMiddleware,
} from "@/middlewares";
import Router from "../Router";
import * as schema from "./schemas";

export class AthleteRouter extends Router {
  /**
   * Method, which initializes router's endpoints when instance is created.
   */
  protected init() {
    this.Routes.use([AccessTokenMiddleware]);
    this.Routes.post(
      "/v1/create",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("athlete", ["create"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.CreateSchema,
      this.validate,
      AthleteController.create
    );
    this.Routes.get(
      "/v1/listing",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("athlete", ["read-all"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      this.schema.PaginationSchema,
      this.validate,
      AthleteController.listing
    );
    this.Routes.get(
      "/v1/:athleteId/view",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("athlete", ["read"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.ViewSchema,
      this.validate,
      AthleteController.view
    );
    this.Routes.put(
      "/v1/:athleteId/edit-account",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("athlete", ["edit"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.EditAccountSchema,
      this.validate,
      AthleteController.editAccount
    );
    this.Routes.put(
      "/v1/:athleteId/edit-data",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("athlete", ["edit"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.EditDataSchema,
      this.validate,
      AthleteController.editData
    );
    this.Routes.delete(
      "/v1/:athleteId/delete",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("athlete", ["delete"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.DeleteSchema,
      this.validate,
      AthleteController.delete
    );
    this.Routes.get(
      "/v1/:athleteId/interactions",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("athlete", ["read"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessAthleteMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      this.schema.PaginationSchema,
      this.validate,
      AthleteController.interactions
    );
  }
}
