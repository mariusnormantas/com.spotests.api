/** @format */

import { Response } from "express";
import mongoose from "mongoose";
import { AthleteService } from "@/services";
import { AuthorizedRequest } from "@/session";
import { ErrorResponse, parsePaginationQuery } from "@/utils";

export class AthleteController {
  /**
   * Controller method, which creates a new athlete.
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

    // Checks, if organization is passed in request's query, cause at this point organization's ID must be defined.
    if (!req.query.organization) {
      throw new ErrorResponse({ status: 400 });
    }

    // Service tries to create a new athlete and returns results.
    const athlete = await AthleteService.create({
      organizationId: new mongoose.Types.ObjectId(
        req.query.organization.toString()
      ),
      name: req.body.name.toString(),
      email: req.body.email.toString(),
      birthDate: new Date(req.body.birthDate),
      height: Number(req.body.height),
      weight: Number(req.body.weight),
      authorId: req.user._id,
    });

    return res.status(200).json({
      athleteId: athlete._id,
      organizationId: athlete.organization,
    });
  }

  /**
   * Controller method, which retrieves list of paginated athletes.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async listing(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Setups listing's pagination.
    const pagination = parsePaginationQuery(req);

    // Setups athletes listing filters.
    const filters = {
      organization: req.query.organization
        ? new mongoose.Types.ObjectId(req.query.organization.toString())
        : undefined,
      team: req.query.team
        ? new mongoose.Types.ObjectId(req.query.team.toString())
        : undefined,
      trainer: req.query.trainer
        ? new mongoose.Types.ObjectId(req.query.trainer.toString())
        : undefined,
      search: req.query.search?.toString() ?? "",
    };

    // Retrieves listing from service.
    const listing = await AthleteService.listing({
      pagination,
      filters,
    });
    return res.status(200).json(listing);
  }

  /**
   * Controller method, which retrieves view's data of athlete.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async view(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Retrieves view data from service.
    const view = await AthleteService.view({
      athleteId: new mongoose.Types.ObjectId(req.params.athleteId),
    });
    return res.status(200).json(view);
  }

  /**
   * Controller method, which edits athletes's account.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async editAccount(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service tries to update athlete's account and returns results.
    const athlete = await AthleteService.editAccount({
      athleteId: new mongoose.Types.ObjectId(req.params.athleteId.toString()),
      name: req.body.name.toString(),
      email: req.body.email.toString(),
      authorId: req.user._id,
    });

    return res.status(200).json({
      athleteId: athlete._id,
      organizationId: athlete.organization,
      // teams: athlete.teams,
    });
  }

  /**
   * Controller method, which edits athletes's information.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async editData(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service tries to update athlete's data and returns results.
    const athlete = await AthleteService.editData({
      athleteId: new mongoose.Types.ObjectId(req.params.athleteId.toString()),
      birthDate: new Date(req.body.birthDate),
      height: Number(req.body.height),
      weight: Number(req.body.weight),
      authorId: req.user._id,
    });

    return res.status(200).json({
      athleteId: athlete._id,
      organizationId: athlete.organization,
    });
  }

  /**
   * Controller method, which deletes trainer.
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

    // Service tries to delete athlete's data.
    const athlete = await AthleteService.delete({
      athleteId: new mongoose.Types.ObjectId(req.params.athleteId.toString()),
      authorId: req.user._id,
    });

    return res.status(200).json({
      athleteId: athlete._id,
      organizationId: athlete.organization,
      // teams: athlete.teams,
    });
  }

  /**
   * Controller method, which retrieves list of athlete's interactions.
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
    const interactions = await AthleteService.interactions({
      athleteId: new mongoose.Types.ObjectId(req.params.athleteId),
      pagination,
    });
    return res.status(200).json(interactions);
  }
}
