/** @format */

import { NextFunction, Response } from "express";
import { AuthorizedRequest } from "@/session";
import { TeamController } from "@/controllers";
import {
  AccessTokenMiddleware,
  RoleAccessMiddleware,
  AccessTeamMiddleware,
} from "@/middlewares";
import Router from "../Router";
import * as schema from "./schemas";

export class TeamRouter extends Router {
  /**
   * Method, which initializes router's endpoints when instance is created.
   */
  protected init() {
    this.Routes.use([AccessTokenMiddleware]);
    this.Routes.post(
      "/v1/create",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["create"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.CreateSchema,
      this.validate,
      TeamController.create
    );
    this.Routes.get(
      "/v1/listing",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["read-all"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      this.schema.PaginationSchema,
      this.schema.SearchSchema,
      this.validate,
      TeamController.listing
    );
    this.Routes.get(
      "/v1/:teamId/view",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["read"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.ViewSchema,
      this.validate,
      TeamController.view
    );
    this.Routes.put(
      "/v1/:teamId/edit",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["edit"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.EditSchema,
      this.validate,
      TeamController.edit
    );
    this.Routes.get(
      "/v1/:teamId/manage-trainers-listing",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["edit"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.ManageTrainersSchema,
      this.schema.PaginationSchema,
      this.schema.SearchSchema,
      this.validate,
      TeamController.manageTrainersListing
    );
    this.Routes.get(
      "/v1/:teamId/manage-athletes-listing",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["edit"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.ManageAthletesSchema,
      this.schema.PaginationSchema,
      this.schema.SearchSchema,
      this.validate,
      TeamController.manageAthletesListing
    );
    this.Routes.put(
      "/v1/:teamId/edit-members",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["edit"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.EditMembersSchema,
      this.validate,
      TeamController.editMembers
    );
    this.Routes.get(
      "/v1/:teamId/interactions",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["read"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.InteractionsSchema,
      this.schema.PaginationSchema,
      this.validate,
      TeamController.interactions
    );
    this.Routes.delete(
      "/v1/:teamId/delete",
      (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        new RoleAccessMiddleware(req, res, next)
          .action("team", ["delete"])
          .grant();
      },
      async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
        const access = new AccessTeamMiddleware(req, res, next);
        await access.determineApplicant();
        access.grant();
      },
      schema.DeleteSchema,
      this.validate,
      TeamController.delete
    );
  }
}
