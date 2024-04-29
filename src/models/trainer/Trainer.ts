/** @format */

import mongoose from "mongoose";
import { TrainerDocument, TrainerMethods, TrainerModel } from "./types";

/**
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 */
const TrainerSchema = new mongoose.Schema<
  TrainerDocument,
  TrainerModel,
  TrainerMethods
>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      trim: true,
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      trim: true,
      required: true,
    },
    interaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interaction",
      trim: true,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Trainer = mongoose.model<TrainerDocument, TrainerModel>(
  "Trainer",
  TrainerSchema
);
