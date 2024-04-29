/** @format */

import mongoose from "mongoose";
import {
  Athlete,
  Interaction,
  Organization,
  Team,
  Testing,
  User,
} from "@/models";
import { ErrorResponse } from "@/utils";
import * as type from "./types";

export class AthleteRepository {
  /**
   * Repository's method, which creates athlete and assigns to organization.
   * @param params CreateParams
   * @returns Promise<CreateData>
   */
  public static async create(
    params: type.CreateParams
  ): Promise<type.CreateData> {
    // Retrieves target organization.
    const organization = await Organization.findById(params.organizationId, [
      "athletesLimit",
    ]).lean();

    if (!organization) {
      throw new ErrorResponse({
        status: 404,
        message:
          "Organization not found, please check provided data or try again later",
      });
    }

    // Retrieves count of athletes assigned to target organization.
    const countAthletesByOrganization = await Athlete.count({
      organization: organization._id,
    }).lean();

    if (countAthletesByOrganization >= organization.athletesLimit) {
      throw new ErrorResponse({
        message: "Athlete can not be created, because limit has been reached",
      });
    }

    // Creates a user for athlete.
    const user = new User({
      email: params.email,
      name: params.name,
      role: "athlete",
      password: await User.generatePassword(),
    });

    // Creating athlete.
    const athlete = new Athlete({
      user: user._id,
      birthDate: params.birthDate,
      height: params.height,
      weight: params.weight,
      organization: organization._id,
    });

    // Creating interaction for organization.
    const organizationInteraction = new Interaction({
      user: organization._id,
      type: "create",
      title: "Athlete created",
      description: params.name,
      author: params.authorId,
    });

    // Creates interaction for athlete.
    const athleteInteraction = new Interaction({
      user: athlete._id,
      type: "create",
      title: "Athlete created",
      author: params.authorId,
    });

    // Assigns athlete's initial interaction.
    athlete.interaction = athleteInteraction._id;

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await user.save({ session: mongooseSession });
        await athlete.save({ session: mongooseSession });
        await organizationInteraction.save({ session: mongooseSession });
        await athleteInteraction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Athlete can not be created, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return athlete;
  }

  /**
   * Repository's method, which retrieves list of paginated athletes.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing({
    pagination,
    filters,
  }: type.ListingParams): Promise<type.ListingData> {
    // Additional filtering by trainer. While filtering athletes by trainer, we use team's athletes.
    let athletesOfTrainer: Array<mongoose.Types.ObjectId> = [];
    if (filters.trainer) {
      const teams = await Team.find(
        {
          trainers: { $in: [filters.trainer] },
        },
        ["athletes"]
      ).lean();
      athletesOfTrainer = teams.flatMap((team) => team.athletes);
    }

    // Additional filtering by team. While filtering athletes by team, we use team's athletes.
    let athletesOfTeam: Array<mongoose.Types.ObjectId> = [];
    if (filters.team) {
      const team = await Team.findById(filters.team, ["athletes"]).lean();
      athletesOfTeam = team?.athletes ?? [];
    }

    // Athletes listing filtered by organization.
    const filterByOrganization = filters.organization
      ? { organization: filters.organization }
      : {};

    // Athletes listing filtered by team.
    const filterByTeam = filters.team
      ? {
          _id: {
            $in: athletesOfTeam,
          },
        }
      : {};

    // Athletes listing filtered by trainer.
    const filterByTrainer = filters.trainer
      ? {
          _id: {
            $in: athletesOfTrainer,
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
    const [listing] = await Athlete.aggregate([
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
          $and: [
            filterBySearch,
            filterByOrganization,
            filterByTeam,
            filterByTrainer,
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
   * Repository's method, which retrieves data of athlete.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    const [athlete] = await Athlete.aggregate([
      {
        $match: { _id: params.athleteId },
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
        $lookup: {
          from: "teams",
          localField: "teams",
          foreignField: "_id",
          as: "teams",
        },
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
          birthDate: 1,
          height: 1,
          weight: 1,
          author: "$author.name",
          verifiedAt: "$user.verifiedAt",
          createdAt: 1,
        },
      },
    ]);

    // Throws error, when athlete not found or not retrieved.
    if (!athlete) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
        status: 404,
      });
    }
    return athlete;
  }

  /**
   * Repository's method, which updates athlete's account.
   * @param params EditAccountParams
   * @returns Promise<EditAccountData>
   */
  public static async editAccount(
    params: type.EditAccountParams
  ): Promise<type.EditAccountData> {
    // Retrieves target athlete from database.
    const athlete = await Athlete.findById(params.athleteId, [
      "user",
      "organization",
      "teams",
    ])
      .populate("user")
      .lean();

    if (!athlete) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Finds athlete's user, to update name and email address.
    const user = await User.findById(athlete.user);
    if (!user) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Updating user's information.
    user.name = params.name;
    user.email = params.email;

    // Creates interaction for athlete.
    const interaction = new Interaction({
      user: athlete._id,
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
            "Athlete can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return athlete;
  }

  /**
   * Repository's method, which updates athlete's data.
   * @param params EditDataParams
   * @returns Promise<EditDataData>
   */
  public static async editData(
    params: type.EditDataParams
  ): Promise<type.EditDataData> {
    // Retrieves target athlete.
    const athlete = await Athlete.findById(params.athleteId);

    if (!athlete) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Updating athlete's information.
    athlete.birthDate = params.birthDate;
    athlete.height = params.height;
    athlete.weight = params.weight;

    // Creates interaction for athlete.
    const interaction = new Interaction({
      user: params.athleteId,
      type: "edit",
      title: "Athlete updated",
      author: params.authorId,
    });

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await athlete.save({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Athlete can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return athlete;
  }

  /**
   * Repository's method, which deletes athlete's data.
   * @param params DeleteParams
   * @returns Promise<DeleteData>
   */
  public static async delete(
    params: type.DeleteParams
  ): Promise<type.DeleteData> {
    // Retrieves target athlete.
    const athlete = await Athlete.findById(params.athleteId);

    if (!athlete) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Retrieves athlete's user.
    const user = await User.findById(athlete.user);

    if (!user) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Creates interaction for athlete's organization.
    const interaction = new Interaction({
      user: athlete.organization,
      type: "delete",
      title: "Athlete deleted",
      description: user.name,
      author: params.authorId,
    });

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await Testing.deleteMany(
          { athlete: athlete._id },
          { session: mongooseSession }
        );
        await athlete.deleteOne({ session: mongooseSession });
        await user.deleteOne({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Athlete can not be deleted, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return athlete;
  }

  /**
   * Repository's method, which retrieves list of athlete's interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    // Retrieves target athlete.
    const athlete = await Athlete.findById(params.athleteId).lean();

    if (!athlete) {
      throw new ErrorResponse({
        message:
          "Athlete not found, please check provided data or try again later",
      });
    }

    // Executes aggregation and retrieves data from database.
    const [interactions] = await Interaction.aggregate([
      {
        $match: { user: athlete._id },
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
