/** @format */

import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "@/session";
import { TrainerController } from "@/controllers";
import {
  AccessTokenMiddleware,
  AccessTrainerMiddleware,
  RoleAccessMiddleware,
} from "@/middlewares";
import Router from "../Router";
import * as schema from "./schemas";

export class TrainerRouter extends Router {
  /**
   * Method, which initializes router's endpoints when instance is created.
   */
  protected init() {
    this.Routes.use([AccessTokenMiddleware]);
    this.Routes.post(
      "/v1/create",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("trainer", ["create"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTrainerMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.CreateSchema,
      this.validate,
      TrainerController.create
    );
    this.Routes.get(
      "/v1/listing",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("trainer", ["read-all"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTrainerMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      this.schema.PaginationSchema,
      this.schema.SearchSchema,
      this.validate,
      TrainerController.listing
    );
    this.Routes.get(
      "/v1/:trainerId/view",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("trainer", ["read"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTrainerMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.ViewSchema,
      this.validate,
      TrainerController.view
    );
    this.Routes.put(
      "/v1/:trainerId/edit-account",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("trainer", ["edit"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTrainerMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.EditAccountSchema,
      this.validate,
      TrainerController.editAccount
    );
    this.Routes.delete(
      "/v1/:trainerId/delete",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("trainer", ["delete"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTrainerMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.DeleteSchema,
      this.validate,
      TrainerController.delete
    );
    this.Routes.get(
      "/v1/:trainerId/interactions",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("trainer", ["read"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTrainerMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.InteractionsSchema,
      this.schema.PaginationSchema,
      this.validate,
      TrainerController.interactions
    );
  }
}
