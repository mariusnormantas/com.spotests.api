/** @format */

import { AthleteDocument, InteractionType } from "@/models";
import mongoose from "mongoose";

export type CreateParams = {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  birthDate: Date;
  height: number;
  weight: number;
  authorId: mongoose.Types.ObjectId;
};

export type CreateData = AthleteDocument;

export type ListingParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    search: string;
    organization?: mongoose.Types.ObjectId;
    team?: mongoose.Types.ObjectId;
    trainer?: mongoose.Types.ObjectId;
  };
};

export type ListingData = {
  documents: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    locked: boolean;
    verifiedAt: string;
    createdAt: string;
  }>;
  total: number;
};

export type ViewParams = {
  athleteId: mongoose.Types.ObjectId;
};

export interface ViewData extends Partial<AthleteDocument> {
  author: string;
}

export type EditAccountParams = {
  athleteId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  authorId: mongoose.Types.ObjectId;
};

export type EditAccountData = AthleteDocument;

export type EditDataParams = {
  athleteId: string | mongoose.Types.ObjectId;
  birthDate: Date;
  height: number;
  weight: number;
  authorId: mongoose.Types.ObjectId;
};

export type EditDataData = AthleteDocument;

export type DeleteParams = {
  athleteId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
};

export type DeleteData = AthleteDocument;

export type InteractionsParams = {
  athleteId: mongoose.Types.ObjectId;
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
