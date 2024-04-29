/** @format */

import mongoose from "mongoose";
import { InteractionType, TeamDocument } from "@/models";

export type CreateParams = {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  authorId: mongoose.Types.ObjectId;
};

export type CreateData = TeamDocument;

export type ListingParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    search: string;
    organization?: mongoose.Types.ObjectId;
    trainer?: mongoose.Types.ObjectId;
  };
};

export type ListingData = {
  documents: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    trainersCount: number;
    athletesCount: number;
    createdAt: string;
  }>;
  total: number;
};

export type ViewParams = {
  teamId: mongoose.Types.ObjectId;
};

export interface ViewData extends Omit<Partial<TeamDocument>, "organization"> {
  organization: {
    _id: string;
    name: string;
  };
  author: string;
}

export type EditParams = {
  teamId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  authorId: mongoose.Types.ObjectId;
};

export type EditData = TeamDocument;

export type ManageTrainersListingParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    team: mongoose.Types.ObjectId;
    search: string;
  };
};

export type ManageTrainersListingData = {
  documents: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  }>;
  selected: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  }>;
  total: number;
};

export type ManageAthletesListingParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    team: mongoose.Types.ObjectId;
    search: string;
  };
};

export type ManageAthletesListingData = {
  documents: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  }>;
  selected: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  }>;
  total: number;
};

export type EditMembersParams = {
  teamId: mongoose.Types.ObjectId;
  trainers: Array<string>;
  athletes: Array<string>;
  authorId: mongoose.Types.ObjectId;
};

export type EditMembersData = {
  team: TeamDocument;
  removed: {
    trainers: Array<mongoose.Types.ObjectId>;
    athletes: Array<mongoose.Types.ObjectId>;
  };
};

export type DeleteParams = {
  teamId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
};

export type DeleteData = TeamDocument;

export type InteractionsParams = {
  teamId: mongoose.Types.ObjectId;
  pagination: {
    page: number;
    limit: number;
  };
};

export type InteractionsData = {
  documents: Array<{
    type: InteractionType;
    title: string;
    description: string;
    createdAt: string;
    author: string;
  }>;
  total: number;
};
