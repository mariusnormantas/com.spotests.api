/** @format */

import { Response } from "express";
import mongoose from "mongoose";
import { TestingService } from "@/services";
import { AuthorizedRequest } from "@/session";
import { ErrorResponse, parsePaginationQuery } from "@/utils";

export class TestingController {
  /**
   * Controller method, which creates a new testing.
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

    // Service tries to create a new testing and returns results.
    const results = await TestingService.create({
      athleteId: new mongoose.Types.ObjectId(req.query.athlete as string),
      ...req.body,
      authorId: req.user._id,
    });

    return res.status(200).json(results);
  }

  /**
   * Controller method, which retrieves paginated list of testings.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async listing(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Setups listing's pagination.
    const pagination = parsePaginationQuery(req);

    // Setups listing's filters.
    const filters = {
      athlete: new mongoose.Types.ObjectId(req.query.athlete as string),
    };

    // Service tries to retrieve listing of testings.
    const listing = await TestingService.listing({
      pagination,
      filters,
    });
    return res.status(200).json(listing);
  }

  /**
   * Controller method, which retrieves summary of testings.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async summary(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Service tries to retrieve summary of testings.
    const summary = await TestingService.summary({
      athlete: new mongoose.Types.ObjectId(req.query.athlete as string),
      testings: (req.query.testings as string)
        .split(",")
        .map((testing) => new mongoose.Types.ObjectId(testing)),
    });
    return res.status(200).json(summary);
  }

  /**
   * Controller method, which deletes testing.
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
    const results = await TestingService.delete({
      testingId: new mongoose.Types.ObjectId(req.params.testingId),
      authorId: req.user._id,
    });
    return res.status(200).json({
      testingId: results.testingId,
      athleteId: results.athleteId,
      organizationId: results.organizationId,
    });
  }
}
