/** @format */

import { Response } from "express";
import mongoose from "mongoose";
import { OrganizationService } from "@/services";
import { AuthorizedRequest } from "@/session";
import { ErrorResponse, parsePaginationQuery } from "@/utils";

export class OrganizationController {
  /**
   * Controller method, which creates a new organization.
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

    // Service tries to create a new organization and returns results.
    const { organization } = await OrganizationService.create({
      name: req.body.name.toString(),
      email: req.body.email.toString(),
      teamsLimit: Number(req.body.teamsLimit) ?? 0,
      trainersLimit: Number(req.body.trainersLimit) ?? 0,
      athletesLimit: Number(req.body.athletesLimit) ?? 0,
      testingsLimit: Number(req.body.testingsLimit) ?? 0,
      authorId: req.user._id,
    });
    return res.status(200).json({ organizationId: organization._id });
  }

  /**
   * Controller method, which retrieves list of paginated organizations.
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
      search: (req.query.search as string) ?? "",
    };

    // Retrieves listing from service.
    const listing = await OrganizationService.listing({ pagination, filters });
    return res.status(200).json(listing);
  }

  /**
   * Controller method, which retrieves view of organization's data.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async view(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Service tries to retrieve organization's data.
    const view = await OrganizationService.view({
      organizationId: new mongoose.Types.ObjectId(req.params.organizationId),
    });
    return res.status(200).json(view);
  }

  /**
   * Controller method, which edits organization's user data.
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

    // Service tries to update organization's user.
    const organization = await OrganizationService.editAccount({
      organizationId: new mongoose.Types.ObjectId(req.params.organizationId),
      name: req.body.name.toString(),
      email: req.body.email.toString(),
      authorId: req.user._id,
    });
    return res.status(200).json({ organizationId: organization._id });
  }

  /**
   * Controller method, which locks/unlocks organization.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async lock(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service tries to update organization's user lock status.
    const organization = await OrganizationService.lock({
      organizationId: new mongoose.Types.ObjectId(req.params.organizationId),
      status: Boolean(req.body.status),
      reason: req.body.reason?.toString(),
      authorId: req.user._id,
    });
    return res.status(200).json({ organizationId: organization._id });
  }

  /**
   * Controller method, which updates organization's limits.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async limits(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, user in request to be able define author for interaction.
    if (!req.user) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service tries to update organization's limits.
    const organization = await OrganizationService.limits({
      organizationId: new mongoose.Types.ObjectId(req.params.organizationId),
      teamsLimit: Number(req.body.teamsLimit),
      trainersLimit: Number(req.body.trainersLimit),
      athletesLimit: Number(req.body.athletesLimit),
      testingsLimit: Number(req.body.testingsLimit),
      authorId: req.user._id,
    });
    return res.status(200).json({ organizationId: organization._id });
  }

  /**
   * Controller method, which retrieves list of organization's interactions.
   * @param req - AuthorizedRequest
   * @param res - Response
   */
  public static async interactions(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Setups listing's pagination.
    const pagination = parsePaginationQuery(req);

    // Service retrieves interactions of organization.
    const interactions = await OrganizationService.interactions({
      organizationId: new mongoose.Types.ObjectId(req.params.organizationId),
      pagination,
    });
    return res.status(200).json(interactions);
  }
}
