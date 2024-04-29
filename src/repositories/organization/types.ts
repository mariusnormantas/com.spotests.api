/** @format */

import mongoose from "mongoose";
import { InteractionType, OrganizationDocument, UserDocument } from "@/models";

export type CreateParams = {
  name: string;
  email: string;
  teamsLimit: number;
  trainersLimit: number;
  athletesLimit: number;
  testingsLimit: number;
  authorId: mongoose.Types.ObjectId;
};

export type CreateData = {
  user: UserDocument;
  organization: OrganizationDocument;
};

export type ListingParams = {
  pagination: {
    page: number;
    limit: number;
  };
  filters: {
    search: string;
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
  organizationId: mongoose.Types.ObjectId;
};

export interface ViewData extends Partial<OrganizationDocument> {
  name: string;
  email: string;
  locked: boolean;
  verifiedAt: string | null;
  teamsCount: number;
  trainersCount: number;
  athletesCount: number;
  testingsCount: number;
}

export type EditAccountParams = {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  authorId: mongoose.Types.ObjectId;
};

export type EditAccountData = OrganizationDocument;

export type LockParams = {
  organizationId: mongoose.Types.ObjectId;
  status: boolean;
  reason?: string;
  authorId: mongoose.Types.ObjectId;
};

export type LockData = OrganizationDocument;

export type LimitsParams = {
  organizationId: mongoose.Types.ObjectId;
  teamsLimit: number;
  trainersLimit: number;
  athletesLimit: number;
  testingsLimit: number;
  authorId: mongoose.Types.ObjectId;
};

export type LimitsData = OrganizationDocument;

export type InteractionsParams = {
  organizationId: mongoose.Types.ObjectId;
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
