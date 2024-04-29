/** @format */

import mongoose from "mongoose";

export interface TrainerDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  interaction: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export type TrainerMethods = {};

export interface TrainerModel
  extends mongoose.Model<TrainerDocument, {}, TrainerMethods> {}
