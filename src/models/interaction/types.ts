/** @format */

import mongoose from "mongoose";

export interface InteractionDocument extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  type: InteractionType;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type InteractionMethods = {};

export interface InteractionModel
  extends mongoose.Model<InteractionDocument, {}, InteractionMethods> {}

export type InteractionType = "create" | "edit" | "lock" | "unlock";
