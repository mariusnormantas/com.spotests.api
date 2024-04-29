/** @format */

import mongoose from "mongoose";
import { Athlete, Interaction, Organization, Team, Trainer } from "@/models";
import { ErrorResponse } from "@/utils";
import * as type from "./types";

export class TeamRepository {
  /**
   * Repository's method, which creates team and assigns to organization.
   * @param params CreateParams
   * @returns Promise<CreateData>
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

    // Assigned teams count and checks if limit is reached.
    const countTeams = await Team.count({
      organizationId: organization._id,
    });

    if (countTeams >= organization.teamsLimit) {
      throw new ErrorResponse({
        message: "Team can not be created, because limit has been reached",
      });
    }

    // Creating team.
    const team = new Team({
      organization: organization._id,
      name: params.name,
      description: params.description,
    });

    // Creating interaction for organization.
    const organizationInteraction = new Interaction({
      user: organization._id,
      type: "create",
      title: "Team created",
      description: params.name,
      author: params.authorId,
    });

    // Creates interaction for team.
    const teamInteraction = new Interaction({
      user: team._id,
      type: "create",
      title: "Team created",
      author: params.authorId,
    });

    // Updates team's data.
    team.interaction = teamInteraction._id;

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await team.save({ session: mongooseSession });
        await organizationInteraction.save({ session: mongooseSession });
        await teamInteraction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Team can not be created, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return team;
  }

  /**
   * Repository's method, which retrieves list of paginated teams.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing({
    pagination,
    filters,
  }: type.ListingParams): Promise<type.ListingData> {
    // Executes aggregation and retrieves data from database.
    const [listing] = await Team.aggregate([
      {
        $match: {
          $and: [
            filters.organization ? { organization: filters.organization } : {},
            filters.trainer ? { trainers: { $in: [filters.trainer] } } : {},
            {
              $or: [
                {
                  name: {
                    $regex: filters.search.split("").join(".*"),
                    $options: "i",
                  },
                },
                { description: { $regex: filters.search, $options: "i" } },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          createdAt: 1,
          trainersCount: { $size: "$trainers" },
          athletesCount: { $size: "$athletes" },
        },
      },
      { $sort: { name: 1 } },
      {
        $facet: {
          documents: [
            { $skip: pagination.limit * (pagination.page - 1) },
            { $limit: pagination.limit },
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
   * Repository's method, which retrieves information of team.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    const [team] = await Team.aggregate([
      {
        $match: { _id: params.teamId },
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
          from: "organizations",
          localField: "organization",
          foreignField: "_id",
          as: "organization",
        },
      },
      {
        $unwind: "$organization",
      },
      {
        $lookup: {
          from: "users",
          localField: "organization.user",
          foreignField: "_id",
          as: "organizationUser",
        },
      },
      {
        $unwind: "$organizationUser",
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          organization: {
            _id: "$organization._id",
            name: "$organizationUser.name",
          },
          trainersCount: { $size: "$trainers" },
          athletesCount: { $size: "$athletes" },
          author: "$author.name",
          createdAt: 1,
        },
      },
    ]);

    // Throws error, when team not found or not retrieved.
    if (!team) {
      throw new ErrorResponse({
        message:
          "Team not found, please check provided data or try again later",
        status: 404,
      });
    }
    return team;
  }

  /**
   * Repository's method, which updates team's data.
   * @param params EditParams
   * @returns Promise<EditData>
   */
  public static async edit(params: type.EditParams): Promise<type.EditData> {
    const team = await Team.findById(params.teamId);

    // Throws error, when organization not found or not retrieved.
    if (!team) {
      throw new ErrorResponse({
        message:
          "Team not found, please check provided data or try again later",
      });
    }

    // Creates interaction.
    const interaction = new Interaction({
      user: team._id,
      type: "edit",
      title: "Team updated",
      author: params.authorId,
    });

    // Updating team's information.
    team.name = params.name;
    team.description = params.description;

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await team.save({ session: mongooseSession });
        await interaction.save({ session: mongooseSession });
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Team can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return team;
  }

  /**
   * Service's method, which retrieves paginated management's listing of trainers.
   * @param params ManagementListingParams
   * @returns Promise<ManagementListingData>
   */
  public static async manageTrainersListing({
    pagination,
    filters,
  }: type.ManageTrainersListingParams): Promise<type.ManageTrainersListingData> {
    // Management listing filters by search.
    const filterBySearch = {
      $or: [
        {
          "trainerUser.name": {
            $regex: filters.search.split("").join(".*"),
            $options: "i",
          },
        },
        { "trainerUser.email": { $regex: filters.search, $options: "i" } },
      ],
    };

    // Runs aggregation with pipeline.
    const [listing] = await Team.aggregate([
      {
        $match: {
          _id: filters.team,
        },
      },
      {
        $lookup: {
          from: "trainers",
          localField: "organization",
          foreignField: "organization",
          as: "trainer",
        },
      },
      {
        $unwind: "$trainer",
      },
      {
        $lookup: {
          from: "users",
          localField: "trainer.user",
          foreignField: "_id",
          as: "trainerUser",
        },
      },
      {
        $unwind: "$trainerUser",
      },
      {
        $match: {
          $and: [filterBySearch],
        },
      },
      { $sort: { "trainerUser.name": 1 } },
      {
        $facet: {
          documents: [
            { $skip: pagination.limit * (pagination.page - 1) },
            { $limit: pagination.limit },
            {
              $project: {
                _id: "$trainer._id",
                name: "$trainerUser.name",
                email: "$trainerUser.email",
              },
            },
          ],
          selected: [
            {
              $set: {
                isTrainerSelected: {
                  $in: ["$trainer._id", "$trainers"],
                },
              },
            },
            {
              $match: {
                isTrainerSelected: true,
              },
            },
            {
              $project: {
                _id: "$trainer._id",
                name: "$trainerUser.name",
                email: "$trainerUser.email",
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    // Checks, if there is results, which matches conditions.
    if (!listing.documents.length || !listing.total[0].count) {
      return { documents: [], selected: [], total: 0 };
    }
    return {
      documents: listing.documents,
      selected: listing.selected,
      total: listing.total[0].count,
    };
  }

  /**
   * Service's method, which retrieves paginated management's listing of athletes.
   * @param params ManagementListingParams
   * @returns Promise<ManagementListingData>
   */
  public static async manageAthletesListing({
    pagination,
    filters,
  }: type.ManageAthletesListingParams): Promise<type.ManageAthletesListingData> {
    // Management listing filters by search.
    const filterBySearch = {
      $or: [
        {
          "athleteUser.name": {
            $regex: filters.search.split("").join(".*"),
            $options: "i",
          },
        },
        { "athleteUser.email": { $regex: filters.search, $options: "i" } },
      ],
    };

    // Runs aggregation with pipeline.
    const [listing] = await Team.aggregate([
      {
        $match: {
          _id: filters.team,
        },
      },
      {
        $lookup: {
          from: "athletes",
          localField: "organization",
          foreignField: "organization",
          as: "athlete",
        },
      },
      {
        $unwind: "$athlete",
      },
      {
        $lookup: {
          from: "users",
          localField: "athlete.user",
          foreignField: "_id",
          as: "athleteUser",
        },
      },
      {
        $unwind: "$athleteUser",
      },
      {
        $match: {
          $and: [filterBySearch],
        },
      },
      { $sort: { "athleteUser.name": 1 } },
      {
        $facet: {
          documents: [
            { $skip: pagination.limit * (pagination.page - 1) },
            { $limit: pagination.limit },
            {
              $project: {
                _id: "$athlete._id",
                name: "$athleteUser.name",
                email: "$athleteUser.email",
              },
            },
          ],
          selected: [
            {
              $set: {
                isAthleteSelected: {
                  $in: ["$athlete._id", "$athletes"],
                },
              },
            },
            {
              $match: {
                isAthleteSelected: true,
              },
            },
            {
              $project: {
                _id: "$athlete._id",
                name: "$athleteUser.name",
                email: "$athleteUser.email",
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    // Checks, if there is results, which matches conditions.
    if (!listing.documents.length || !listing.total[0].count) {
      return { documents: [], selected: [], total: 0 };
    }
    return {
      documents: listing.documents,
      selected: listing.selected,
      total: listing.total[0].count,
    };
  }

  /**
   * Repository's method, which updates team's information.
   * @param params EditMembersParams
   * @returns Promise<EditMembersData>
   */
  public static async editMembers(
    params: type.EditMembersParams
  ): Promise<type.EditMembersData> {
    // Retrieves target team, which is manipulating.
    const team = await Team.findById(params.teamId).lean();

    // Throws error, when organization not found or not retrieved.
    if (!team) {
      throw new ErrorResponse({
        message:
          "Team not found, please check provided data or try again later",
      });
    }

    // Creates interaction for team.
    const teamInteraction = new Interaction({
      user: team._id,
      type: "edit",
      title: "Members updated",
      author: params.authorId,
    });

    // Retrieves added trainers, not to create duplicate of interaction.
    const addedTrainers = await Trainer.find(
      {
        $and: [
          {
            _id: { $in: params.trainers },
          },
          {
            _id: { $nin: team.trainers },
          },
        ],
        organization: team.organization,
      },
      ["_id"]
    ).lean();

    // Creates interaction for every added trainer.
    const addedTrainersInteractions = addedTrainers.map(
      (trainer) =>
        new Interaction({
          user: trainer._id,
          type: "edit",
          title: "Team added",
          description: team.name,
          author: params.authorId,
        })
    );

    // Retrieves added athletes, not to create duplicate of interaction.
    const addedAthletes = await Athlete.find(
      {
        $and: [
          {
            _id: { $in: params.athletes },
          },
          {
            _id: { $nin: team.athletes },
          },
        ],
        organization: team.organization,
      },
      ["_id"]
    ).lean();

    // Creates interaction for every added athlete.
    const addedAthletesInteractions = addedAthletes.map(
      (athlete) =>
        new Interaction({
          user: athlete._id,
          type: "edit",
          title: "Team added",
          description: team.name,
          author: params.authorId,
        })
    );

    // Retrieves removable trainers, which were not selected or unselected from team.
    const removedTrainers = await Trainer.find(
      {
        $and: [
          {
            _id: { $nin: params.trainers },
          },
          {
            _id: { $in: team.trainers },
          },
        ],
        organization: team.organization,
      },
      ["_id"]
    ).lean();

    // Creates interaction for every removed trainer.
    const removedTrainersInteractions = removedTrainers.map(
      (trainer) =>
        new Interaction({
          user: trainer._id,
          type: "edit",
          title: "Team removed",
          description: team.name,
          author: params.authorId,
        })
    );

    // Retrieves removable athletes, which were not selected or unselected from team.
    const removedAthletes = await Athlete.find(
      {
        $and: [
          {
            _id: { $nin: params.athletes },
          },
          {
            _id: { $in: team.athletes },
          },
        ],
        organization: team.organization,
      },
      ["_id"]
    ).lean();

    // Creates interaction for every removed athlete.
    const removedAthletesInteractions = removedAthletes.map(
      (athlete) =>
        new Interaction({
          user: athlete._id,
          type: "edit",
          title: "Team removed",
          description: team.name,
          author: params.authorId,
        })
    );

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await Team.updateOne(
          { _id: params.teamId, organization: team.organization },
          { trainers: params.trainers, athletes: params.athletes },
          { session: mongooseSession }
        );
        await teamInteraction.save({ session: mongooseSession });
        await Interaction.bulkSave(
          [
            ...addedTrainersInteractions,
            ...addedAthletesInteractions,
            ...removedTrainersInteractions,
            ...removedAthletesInteractions,
          ],
          {
            session: mongooseSession,
          }
        );
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Team can not be updated, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return {
      team,
      removed: {
        trainers: removedTrainers.flatMap((trainer) => trainer._id),
        athletes: removedAthletes.flatMap((athlete) => athlete._id),
      },
    };
  }

  /**
   * Repository's method, which deletes team.
   * @param params DeleteParams
   * @returns Promise<DeleteData>
   */
  public static async delete(
    params: type.DeleteParams
  ): Promise<type.DeleteData> {
    // Retrieves target team.
    const team = await Team.findById(params.teamId);

    // Throws error, when organization not found or not retrieved.
    if (!team) {
      throw new ErrorResponse({
        message:
          "Team not found, please check provided data or try again later",
      });
    }

    // Creates interaction for team's organization.
    const organizationInteraction = new Interaction({
      user: team.organization,
      type: "delete",
      title: "Team deleted",
      description: team.name,
      author: params.authorId,
    });

    // Creates interaction for every trainer of the team.
    const removedTrainersInteractions = team.trainers.map(
      (trainerId) =>
        new Interaction({
          user: trainerId,
          type: "edit",
          title: "Team removed",
          description: team.name,
          author: params.authorId,
        })
    );

    // Creates interaction for every athlete of the team.
    const removedAthletesInteractions = team.athletes.map(
      (athleteId) =>
        new Interaction({
          user: athleteId,
          type: "edit",
          title: "Team removed",
          description: team.name,
          author: params.authorId,
        })
    );

    // Initializes mongoose session and performs merged actions.
    const mongooseSession = await mongoose.startSession();
    await mongooseSession
      .withTransaction(async () => {
        await team.deleteOne({ session: mongooseSession });
        await organizationInteraction.save({ session: mongooseSession });
        await Interaction.deleteMany(
          { user: team._id },
          { session: mongooseSession }
        );
        await Interaction.bulkSave(
          [...removedTrainersInteractions, ...removedAthletesInteractions],
          {
            session: mongooseSession,
          }
        );
      })
      .catch(() => {
        throw new ErrorResponse({
          message:
            "Team can not be deleted, please check provided data or try again later",
        });
      });
    await mongooseSession.endSession();
    return team;
  }

  /**
   * Repository's method, which retrieves list of interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    // Retrieves target team.
    const team = await Team.findById(params.teamId).lean();

    // Throws error, when team not found or not retrieved.
    if (!team) {
      throw new ErrorResponse({
        message:
          "Team not found, please check provided data or try again later",
      });
    }

    // Executes aggregation and retrieves data from database.
    const [interactions] = await Interaction.aggregate([
      {
        $match: { user: team._id },
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
