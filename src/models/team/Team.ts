/** @format */

import mongoose from "mongoose";
import { TeamDocument, TeamMethods, TeamModel } from "./types";

/**
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 */
const TeamSchema = new mongoose.Schema<TeamDocument, TeamModel, TeamMethods>(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      trim: true,
      required: true,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 64,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      maxlength: 250,
      trim: true,
    },
    trainers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
        default: [],
        trim: true,
        required: true,
      },
    ],
    athletes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Athletes",
        default: [],
        trim: true,
        required: true,
      },
    ],
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

/**
 * Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins.
 */
TeamSchema.pre("validate", function (next) {
  this.trainers = [...new Set(this.trainers)];
  this.athletes = [...new Set(this.athletes)];
  next();
});

export const Team = mongoose.model<TeamDocument, TeamModel>("Team", TeamSchema);
