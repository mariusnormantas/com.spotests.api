/** @format */

import mongoose from "mongoose";
import * as type from "./types";

/**
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 */
const AthleteSchema = new mongoose.Schema<
  type.AthleteDocument,
  type.AthleteModel,
  type.AthleteMethods
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
    birthDate: {
      type: Date,
      trim: true,
      required: true,
    },
    height: {
      type: Number,
      min: 0,
      max: 300,
      trim: true,
      required: true,
    },
    weight: {
      type: Number,
      min: 0,
      max: 300,
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

export const Athlete = mongoose.model<type.AthleteDocument, type.AthleteModel>(
  "Athlete",
  AthleteSchema
);
