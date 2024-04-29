/** @format */

import mongoose from "mongoose";

export interface AthleteDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  birthDate: Date;
  height: number;
  weight: number;
  interaction: mongoose.Types.ObjectId;
  createdAt: string;
  updatedAt: string;
}

export type AthleteMethods = {};

export interface AthleteModel
  extends mongoose.Model<AthleteDocument, {}, AthleteMethods> {}
