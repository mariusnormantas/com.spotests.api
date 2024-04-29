/** @format */

import mongoose from "mongoose";
import { InteractionType, TrainerDocument } from "@/models";

export type CreateParams = {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  authorId: mongoose.Types.ObjectId;
};

export type CreateData = TrainerDocument;

export type ListingParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    search: string;
    organization?: string | mongoose.Types.ObjectId;
    team?: string | mongoose.Types.ObjectId;
  };
};

export type ListingData = {
  documents: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    locked: boolean;
    verifiedAt: string | null;
    createdAt: string;
  }>;
  total: number;
};

export type ViewParams = {
  trainerId: mongoose.Types.ObjectId;
};

export interface ViewData
  extends Omit<Partial<TrainerDocument>, "organization"> {
  name: string;
  email: string;
  organization: {
    _id: string;
    name: string;
  };
  author: string;
  locked: boolean;
  verifiedAt: string | null;
}

export type EditAccountParams = {
  trainerId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  authorId: mongoose.Types.ObjectId;
};

export type EditAccountData = TrainerDocument;

export type DeleteParams = {
  trainerId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
};

export type DeleteData = TrainerDocument;

export type ManagementListingParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    organization: mongoose.Types.ObjectId;
    team: mongoose.Types.ObjectId;
    search: string;
  };
};

export type ManagementListingData = {
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

export type InteractionsParams = {
  trainerId: mongoose.Types.ObjectId;
  pagination: {
    page: number;
    limit: number;
  };
};

export type InteractionsData = {
  documents: {
    type: InteractionType;
    title: string;
    description: string;
    createdAt: string;
    author: string;
  }[];
  total: number;
};
