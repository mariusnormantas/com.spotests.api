/** @format */

import mongoose from "mongoose";
import { Interaction, Organization, User } from "@/models";
import { ErrorResponse } from "@/utils";
import * as type from "./types";

export class OrganizationRepository {
  /**
   * Repository's method, which creates organization and assigns user at the same time.
   * @param params CreateParams
   * @returns Promise<CreateData>
   */
  public static async create(
    params: type.CreateParams
  ): Promise<type.CreateData> {
    // Creates a user for organization.
    const user = new User({
      email: params.email,
      name: params.name,
      role: "organization",
      password: await User.generatePassword(),
    });

    // Creating organization.
    const organization = new Organization({
      user: user._id,
      teamsLimit: params.teamsLimit,
      trainersLimit: params.trainersLimit,
      athletesLimit: params.athletesLimit,
      testingsLimit: params.testingsLimit,
    });

    // Creates interaction.
    const interaction = new Interaction({
      user: organization._id,
      type: "create",
      title: "Organization created",
      author: params.authorId,
    });

    // Assigns organization's initial interaction.
    organization.interaction = interaction._id;

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await user.save({ session: mongooseSession });
        await organization.save({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Organization can not be created, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return { user, organization };
  }

  /**
   * Repository's method, which retrieves list of paginated organizations.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing(
    params: type.ListingParams
  ): Promise<type.ListingData> {
    // Executes aggregation and retrieves data from database.
    const [listing] = await Organization.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          "_id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.locked": 1,
          "user.verifiedAt": 1,
          "createdAt": 1,
        },
      },
      {
        $match: {
          $or: [
            {
              "user.name": {
                $regex: params.filters.search.split("").join(".*"),
                $options: "i",
              },
            },
            {
              "user.email": {
                $regex: params.filters.search,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: { $arrayElemAt: ["$user.name", 0] } },
          email: { $first: { $arrayElemAt: ["$user.email", 0] } },
          locked: { $first: { $arrayElemAt: ["$user.locked", 0] } },
          verifiedAt: { $first: { $arrayElemAt: ["$user.verifiedAt", 0] } },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { name: 1 } },
      {
        $facet: {
          documents: [
            { $skip: params.pagination.limit * (params.pagination.page - 1) },
            { $limit: params.pagination.limit },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                locked: 1,
                verifiedAt: 1,
                createdAt: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    // Checks, if there is results, which matches conditions.
    if (!listing.documents.length || !listing.total[0].count) {
      return { documents: [], total: 0 };
    }
    return {
      documents: listing.documents,
      total: listing.total[0].count,
    };
  }

  /**
   * Repository's method, which retrieves information about organization which is used in the view on client side.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    const [organization] = await Organization.aggregate([
      {
        $match: {
          _id: params.organizationId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          user: {
            name: 1,
            email: 1,
            locked: 1,
            verifiedAt: 1,
          },
          teamsLimit: 1,
          trainersLimit: 1,
          athletesLimit: 1,
          testingsLimit: 1,
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "_id",
          foreignField: "organization",
          as: "teams",
        },
      },
      {
        $lookup: {
          from: "trainers",
          localField: "_id",
          foreignField: "organization",
          as: "trainers",
        },
      },
      {
        $lookup: {
          from: "athletes",
          localField: "_id",
          foreignField: "organization",
          as: "athletes",
        },
      },
      {
        $addFields: {
          athleteIds: {
            $map: { input: "$athletes", as: "athlete", in: "$$athlete._id" },
          },
        },
      },
      {
        $lookup: {
          from: "testings",
          let: { orgId: "$_id", athletes: "$athleteIds" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $in: ["$athlete", "$$athletes"] }],
                },
              },
            },
          ],
          as: "testings",
        },
      },
      {
        $project: {
          _id: 1,
          name: "$user.name",
          email: "$user.email",
          locked: "$user.locked",
          verifiedAt: "$user.verifiedAt",
          createdAt: 1,
          teamsCount: { $size: "$teams" },
          teamsLimit: 1,
          trainersCount: { $size: "$trainers" },
          trainersLimit: 1,
          athletesCount: { $size: "$athletes" },
          athletesLimit: 1,
          testingsCount: { $size: "$testings" },
          testingsLimit: 1,
        },
      },
    ]).exec();

    // Throws error, when organization not found or not retrieved.
    if (!organization) {
      throw new ErrorResponse({
        message:
          "Organization not found, please check provided data or try again later",
        status: 404,
      });
    }
    return organization;
  }

  /**
   * Repository's method, which updates organization's user data.
   * @param params EditAccountParams
   * @returns Promise<EditAccountData>
   */
  public static async editAccount(
    params: type.EditAccountParams
  ): Promise<type.EditAccountData> {
    const organizationId = new mongoose.Types.ObjectId(params.organizationId);
    const organization = await Organization.findById(organizationId, [
      "user",
    ]).lean();

    // Throws error, when organization not found or not retrieved.
    if (!organization) {
      throw new ErrorResponse({
        message:
          "Organization not found, please check provided data or try again later",
      });
    }

    // Finds organization's user, to update name and email address.
    const user = await User.findById(organization.user);
    if (!user) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Updating user's information.
    user.name = params.name;
    user.email = params.email;

    // Creates interaction.
    const interaction = new Interaction({
      user: organization._id,
      type: "edit",
      title: "Account updated",
      author: params.authorId,
    });

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await user.save({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Organization can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return organization;
  }

  /*
   * Repository's method, which updates organization's user lock status.
   * @param params LockParams
   * @returns Promise<LockData>
   */
  public static async lock(params: type.LockParams): Promise<type.LockData> {
    const organization = await Organization.findById(
      params.organizationId
    ).lean();

    // Throws error, when organization not found or not retrieved.
    if (!organization) {
      throw new ErrorResponse({
        message:
          "Organization not found, please check provided data or try again later",
      });
    }

    // Finds organization's user, to update name and email address.
    const user = await User.findById(organization.user);
    if (!user) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Updating user's information.
    user.locked = params.status;

    // Creates interaction.
    const interaction = new Interaction({
      user: organization._id,
      type: params.status ? "lock" : "unlock",
      title: params.status ? "Account locked" : "Account unlocked",
      description: params.reason,
      author: params.authorId,
    });

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await user.save({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Organization can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return organization;
  }

  /**
   * Repository's method, which updates organization's limits.
   * @param params LimitsParams
   * @returns Promise<LimitsData>
   */
  public static async limits(
    params: type.LimitsParams
  ): Promise<type.LimitsData> {
    const organization = await Organization.findById(params.organizationId);

    // Throws error, when organization not found or not retrieved.
    if (!organization) {
      throw new ErrorResponse({
        message:
          "Organization not found, please check provided data or try again later",
      });
    }

    // Updating organization's limits.
    organization.teamsLimit = params.teamsLimit;
    organization.trainersLimit = params.trainersLimit;
    organization.athletesLimit = params.athletesLimit;
    organization.testingsLimit = params.testingsLimit;

    // Creates interaction.
    const interaction = new Interaction({
      user: organization._id,
      type: "edit",
      title: "Limits updated",
      author: params.authorId,
    });

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await organization.save({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Organization can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return organization;
  }

  /**
   * Repository's method, which retrieves list of paginated interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    const organization = await Organization.findById(
      params.organizationId
    ).lean();

    // Throws error, when organization not found or not retrieved.
    if (!organization) {
      throw new ErrorResponse({
        message:
          "Organization not found, please check provided data or try again later",
      });
    }

    // Executes aggregation and retrieves data from database.
    const [interactions] = await Interaction.aggregate([
      {
        $match: { user: organization._id },
      },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          _id: 0,
          type: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          author: {
            name: 1,
          },
        },
      },
      {
        $facet: {
          documents: [
            { $skip: params.pagination.limit * (params.pagination.page - 1) },
            { $limit: params.pagination.limit },
            {
              $project: {
                type: 1,
                title: 1,
                description: 1,
                createdAt: 1,
                author: "$author.name",
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    // Checks, if there is results, which matches conditions.
    if (!interactions.documents.length || !interactions.total[0].count) {
      return { documents: [], total: 0 };
    }
    return {
      documents: interactions.documents,
      total: interactions.total[0].count,
    };
  }
}
