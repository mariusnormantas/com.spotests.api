/** @format */

import mongoose from "mongoose";

export interface TeamDocument extends mongoose.Document {
  organization: mongoose.Types.ObjectId;
  name: string;
  description: string;
  trainers: Array<mongoose.Types.ObjectId>;
  athletes: Array<mongoose.Types.ObjectId>;
  interaction: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export type TeamMethods = {};

export interface TeamModel
  extends mongoose.Model<TeamDocument, {}, TeamMethods> {}
