/** @format */

import mongoose from "mongoose";
import { ErrorResponse } from "@/utils";
import { Interaction, Organization, Team, Trainer, User } from "@/models";
import * as type from "./types";

export class TrainerRepository {
  /**
   * Service's method, which creates trainer and assigns to organization.
   * @param params CreateParams
   * @returns Promise<TrainerDocument>
   */
  public static async create(
    params: type.CreateParams
  ): Promise<type.CreateData> {
    // Retrieves organization's data.
    const organization = await Organization.findById(
      params.organizationId
    ).lean();

    if (!organization) {
      throw new ErrorResponse({
        status: 404,
        message:
          "Organization not found, please check provided data or try again later",
      });
    }

    // Assigned trainers count and checks if limit is reached.
    const countTrainers = await Trainer.count({
      organizationId: organization._id,
    });
    if (countTrainers >= organization.trainersLimit) {
      throw new ErrorResponse({
        message: "Trainer can not be created, because limit has been reached",
      });
    }

    // Creates a user for trainer.
    const user = new User({
      email: params.email,
      name: params.name,
      role: "trainer",
      password: await User.generatePassword(),
    });

    // Creating trainer.
    const trainer = new Trainer({
      user: user._id,
      organization: organization._id,
    });

    // Creating interaction for organization.
    const organizationInteraction = new Interaction({
      user: organization._id,
      type: "create",
      title: "Trainer created",
      description: params.name,
      author: params.authorId,
    });

    // Creates interaction for trainer.
    const trainerInteraction = new Interaction({
      user: trainer._id,
      type: "create",
      title: "Trainer created",
      author: params.authorId,
    });

    // Assigns trainer's initial interaction.
    trainer.interaction = trainerInteraction._id;

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await user.save({ session: mongooseSession });
        await trainer.save({ session: mongooseSession });
        await organizationInteraction.save({ session: mongooseSession });
        await trainerInteraction.save({ session: mongooseSession });
      })
      .catch((e) => {
        throw new ErrorResponse({
          message:
            "Trainer can not be created, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return trainer;
  }

  /**
   * Service's method, which retrieves paginated list of trainers.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing({
    pagination,
    filters,
  }: type.ListingParams): Promise<type.ListingData> {
    // Additional filtering by team. While filtering trainers by team, we use team's trainers.
    let trainersOfTeam: Array<mongoose.Types.ObjectId> = [];
    if (filters.team) {
      const team = await Team.findById(filters.team, ["trainers"]).lean();
      trainersOfTeam = team?.trainers ?? [];
    }

    // Trainers listing filters by organization.
    const filterByOrganization = filters.organization
      ? { organization: filters.organization }
      : {};

    // Trainers listing filtered by team.
    const filterByTeam = filters.team
      ? {
          _id: {
            $in: trainersOfTeam,
          },
        }
      : {};

    // Listing's filters by search.
    const filterBySearch = {
      $or: [
        {
          "user.name": {
            $regex: filters.search.split("").join(".*"),
            $options: "i",
          },
        },
        { "user.email": { $regex: filters.search, $options: "i" } },
      ],
    };

    // Executes aggregation and retrieves data from database.
    const [listing] = await Trainer.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $match: {
          $and: [filterBySearch, filterByOrganization, filterByTeam],
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
            { $skip: pagination.limit * (pagination.page - 1) },
            { $limit: pagination.limit },
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
   * Service's method, which retrieves data of trainer.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    const [trainer] = await Trainer.aggregate([
      {
        $match: { _id: params.trainerId },
      },
      {
        $lookup: {
          from: "interactions",
          localField: "interaction",
          foreignField: "_id",
          as: "interaction",
        },
      },
      {
        $unwind: "$interaction",
      },
      {
        $lookup: {
          from: "users",
          localField: "interaction.author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
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
        $lookup: {
          from: "organizations",
          localField: "organization",
          foreignField: "_id",
          as: "orgData",
        },
      },
      {
        $unwind: "$orgData",
      },
      {
        $lookup: {
          from: "users",
          localField: "orgData.user",
          foreignField: "_id",
          as: "orgUser",
        },
      },
      {
        $unwind: "$orgUser",
      },
      {
        $project: {
          _id: 1,
          name: "$user.name",
          email: "$user.email",
          locked: "$user.locked",
          organization: {
            _id: "$orgData._id",
            name: "$orgUser.name",
            locked: "$orgUser.locked",
          },
          author: "$author.name",
          verifiedAt: "$user.verifiedAt",
          createdAt: 1,
        },
      },
    ]);

    // Throws error, when trainer not found or not retrieved.
    if (!trainer) {
      throw new ErrorResponse({
        message:
          "Trainer not found, please check provided data or try again later",
        status: 404,
      });
    }
    return trainer;
  }

  /**
   * Method, which updates trainer's user.
   * @param params EditAccountParams
   * @returns Promise<EditAccountData>
   */
  public static async editAccount(
    params: type.EditAccountParams
  ): Promise<type.EditAccountData> {
    const trainer = await Trainer.findById(params.trainerId, [
      "user",
      "organization",
    ]).lean();

    // Throws error, when organization not found or not retrieved.
    if (!trainer) {
      throw new ErrorResponse({
        message:
          "Trainer not found, please check provided data or try again later",
      });
    }

    // Finds trainer's user, to update name and email address.
    const user = await User.findById(trainer.user);
    if (!user) {
      throw new ErrorResponse({
        message:
          "Trainer not found, please check provided data or try again later",
      });
    }

    // Updating user's information.
    user.name = params.name;
    user.email = params.email;

    // Creates interaction for trainer.
    const interaction = new Interaction({
      user: trainer._id,
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
            "Trainer can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return trainer;
  }

  /**
   * Service's method, which deletes trainer.
   * @param params DeleteParams
   * @returns Promise<DeleteData>
   */
  public static async delete(
    params: type.DeleteParams
  ): Promise<type.DeleteData> {
    const trainer = await Trainer.findById(params.trainerId);

    // Throws error, when organization not found or not retrieved.
    if (!trainer) {
      throw new ErrorResponse({
        message:
          "Trainer not found, please check provided data or try again later",
      });
    }

    // Retrieves trainer's user.
    const user = await User.findById(trainer.user);
    if (!user) {
      throw new ErrorResponse({
        message:
          "Trainer not found, please check provided data or try again later",
      });
    }

    // Creates interaction for trainer's organization.
    const interaction = new Interaction({
      user: trainer.organization,
      type: "delete",
      title: "Trainer deleted",
      description: user.name,
      author: params.authorId,
    });

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await trainer.deleteOne({ session: mongooseSession });
        await user.deleteOne({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch((e) => {
        throw new ErrorResponse({
          message:
            "Trainer can not be deleted, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return trainer;
  }

  /**
   * Service's method, which retrieves list of interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    const trainer = await Trainer.findById(params.trainerId).lean();

    // Throws error, when team not found or not retrieved.
    if (!trainer) {
      throw new ErrorResponse({
        message:
          "Trainer not found, please check provided data or try again later",
      });
    }

    // Executes aggregation and retrieves data from database.
    const [interactions] = await Interaction.aggregate([
      {
        $match: { user: trainer._id },
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
