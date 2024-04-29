/** @format */

import mongoose from "mongoose";
import {
  InteractionDocument,
  InteractionMethods,
  InteractionModel,
} from "./types";

/**
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 */
const InteractionSchema = new mongoose.Schema<
  InteractionDocument,
  InteractionModel,
  InteractionMethods
>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["create", "edit", "lock", "unlock", "delete"],
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "No title",
    },
    description: {
      type: String,
      trim: true,
      default: "No description",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Middleware (also called pre and post hooks) are functions which are passed control during execution of asynchronous functions. Middleware is specified on the schema level and is useful for writing plugins.
 */
InteractionSchema.pre("save", async function (next) {
  if (!this.description.length) {
    this.description = "No description";
  }
  if (!this.title.length) {
    this.title = "No title";
  }
  next();
});

export const Interaction = mongoose.model<
  InteractionDocument,
  InteractionModel
>("Interaction", InteractionSchema);
