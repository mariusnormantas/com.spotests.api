/** @format */

import { Response } from "express";
import mongoose from "mongoose";
import { TeamService } from "@/services";
import { AuthorizedRequest } from "@/session";
import { ErrorResponse, parsePaginationQuery } from "@/utils";

export class TeamController {
  /**
   * Controller method, which creates a new team.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async create(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Checks, if organization is passed in request's query.
    if (!req.query.organization) {
      throw new ErrorResponse({ status: 400 });
    }

    // Service tries to create a new team.
    const team = await TeamService.create({
      organizationId: new mongoose.Types.ObjectId(
        req.query.organization as string
      ),
      name: req.body.name.toString(),
      description: req.body.description.toString() ?? "",
      authorId: req.user._id,
    });

    return res.status(200).json({
      teamId: team._id,
      organizationId: team.organization,
    });
  }

  /**
   * Controller method, which retrieves list of paginated teams.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async listing(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Setups listing's pagination.
    const pagination = parsePaginationQuery(req);

    // Setups trainers filters.
    const filters = {
      organization: req.query.organization
        ? new mongoose.Types.ObjectId(req.query.organization as string)
        : undefined,
      trainer: req.query.trainer
        ? new mongoose.Types.ObjectId(req.query.trainer as string)
        : undefined,
      search: (req.query.search as string) ?? "",
    };

    // Retrieves listing from service.
    const listing = await TeamService.listing({
      pagination,
      filters,
    });
    return res.status(200).json(listing);
  }

  /**
   * Controller method, which retrieves view of team.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async view(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Retrieves view data from service.
    const view = await TeamService.view({
      teamId: new mongoose.Types.ObjectId(req.params.teamId),
    });
    return res.status(200).json(view);
  }

  /**
   * Controller method, which edits team's information.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async edit(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service tries to update team's data.
    const team = await TeamService.edit({
      teamId: new mongoose.Types.ObjectId(req.params.teamId),
      name: req.body.name.toString(),
      description: req.body.description.toString() ?? "",
      authorId: req.user._id,
    });

    return res.status(200).json({
      teamId: team._id,
      organizationId: team.organization,
    });
  }

  /**
   * Controller method, which retrieves paginated listing of managable trainers.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async manageTrainersListing(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Setups listing's pagination.
    const pagination = parsePaginationQuery(req);

    // Setups trainers filters.
    const filters = {
      team: new mongoose.Types.ObjectId(req.params.teamId),
      search: (req.query.search as string) ?? "",
    };

    // Retrieves listing from service.
    const listing = await TeamService.manageTrainersListing({
      pagination,
      filters,
    });
    return res.status(200).json(listing);
  }

  /**
   * Controller method, which retrieves paginated listing of managable athletes.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async manageAthletesListing(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Setups listing's pagination.
    const pagination = parsePaginationQuery(req);

    // Setups athletes filters.
    const filters = {
      team: new mongoose.Types.ObjectId(req.params.teamId),
      search: (req.query.search as string) ?? "",
    };

    // Retrieves listing from service.
    const listing = await TeamService.manageAthletesListing({
      pagination,
      filters,
    });
    return res.status(200).json(listing);
  }

  /**
   * Controller method, which edits team's members (trainers and athletes).
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async editMembers(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service updates team's members.
    const { team, removed } = await TeamService.editMembers({
      teamId: new mongoose.Types.ObjectId(req.params.teamId),
      trainers: req.body.trainers,
      athletes: req.body.athletes,
      authorId: req.user._id,
    });
    return res.status(200).json({
      teamId: team._id,
      organizationId: team.organization,
      removed,
    });
  }

  /**
   * Controller method, which deletes team.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async delete(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service tries to delete team.
    const team = await TeamService.delete({
      teamId: new mongoose.Types.ObjectId(req.params.teamId),
      authorId: req.user._id,
    });

    return res.status(200).json({
      teamId: team._id,
      organizationId: team.organization,
    });
  }

  /**
   * Controller method, which retrieves list of interactions.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async interactions(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Setups listing's pagination.
    const pagination = parsePaginationQuery(req);

    // Retrieves listing from service.
    const interactions = await TeamService.interactions({
      teamId: new mongoose.Types.ObjectId(req.params.teamId),
      pagination,
    });
    return res.status(200).json(interactions);
  }
}
