/** @format */

import { Response } from "express";
import mongoose from "mongoose";
import { TrainerService } from "@/services";
import { AuthorizedRequest } from "@/session";
import { ErrorResponse, parsePaginationQuery } from "@/utils";

export class TrainerController {
  /**
   * Controller method, which creates a new trainer.
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
    // if (!req.query.organization) {
    //   return res.sendStatus(400);
    // }

    // Service tries to create a new trainer and returns results.
    const trainer = await TrainerService.create({
      organizationId: new mongoose.Types.ObjectId(
        req.query.organization as string
      ),
      name: req.body.name.toString(),
      email: req.body.email.toString(),
      authorId: req.user._id,
    });

    return res
      .status(200)
      .json({ trainerId: trainer._id, organizationId: trainer.organization });
  }

  /**
   * Controller method, which retrieves list of paginated trainers.
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
      team: req.query.team
        ? new mongoose.Types.ObjectId(req.query.team as string)
        : undefined,
      search: (req.query.search as string) ?? "",
    };

    // Service tries to retrieve listing.
    const listing = await TrainerService.listing({
      pagination,
      filters,
    });
    return res.status(200).json(listing);
  }

  /**
   * Controller method, which retrieves view of trainer.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async view(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    const view = await TrainerService.view({
      trainerId: new mongoose.Types.ObjectId(req.params.trainerId),
    });
    return res.status(200).json(view);
  }

  /**
   * Controller method, which edits trainer's user.
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

    // Service tries to edit trainer's account.
    const trainer = await TrainerService.editAccount({
      trainerId: new mongoose.Types.ObjectId(req.params.trainerId),
      name: req.body.name.toString(),
      email: req.body.email.toString(),
      authorId: req.user._id,
    });

    return res.status(200).json({
      trainerId: trainer._id,
      organizationId: trainer.organization,
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

    // Retrieves view data from service.
    const trainer = await TrainerService.delete({
      trainerId: new mongoose.Types.ObjectId(req.params.trainerId),
      authorId: req.user._id,
    });

    return res.status(200).json({
      trainerId: trainer._id,
      organizationId: trainer.organization,
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
    const interactions = await TrainerService.interactions({
      trainerId: new mongoose.Types.ObjectId(req.params.trainerId),
      pagination,
    });
    return res.status(200).json(interactions);
  }
}
