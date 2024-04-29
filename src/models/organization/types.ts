/** @format */

import mongoose from "mongoose";
import { UserDocument } from "../user";

export interface OrganizationDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  teamsLimit: number;
  trainersLimit: number;
  athletesLimit: number;
  testingsLimit: number;
  interaction: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export type OrganizationMethods = {
  getUser: () => Promise<UserDocument>;
};

export interface OrganizationModel
  extends mongoose.Model<OrganizationDocument, {}, OrganizationMethods> {}
