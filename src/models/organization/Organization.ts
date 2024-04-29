/** @format */

import mongoose from "mongoose";
import * as type from "./types";
import { UserDocument } from "../user";

/**
 * Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
 */
const OrganizationSchema = new mongoose.Schema<
  type.OrganizationDocument,
  type.OrganizationModel,
  type.OrganizationMethods
>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      trim: true,
    },
    teamsLimit: {
      type: Number,
      min: 0,
      max: 9999,
      default: 0,
      required: true,
    },
    trainersLimit: {
      type: Number,
      min: 0,
      max: 9999,
      default: 0,
      required: true,
    },
    athletesLimit: {
      type: Number,
      min: 0,
      max: 9999,
      default: 0,
      required: true,
    },
    testingsLimit: {
      type: Number,
      min: 0,
      max: 9999,
      default: 0,
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

/**
 * To define an instance method in TypeScript, create a new interface representing your instance methods. You need to pass that interface as the 3rd generic parameter to the Schema constructor and as the 3rd generic parameter to Model as shown below.
 */
OrganizationSchema.method("getUser", async function () {
  const user: UserDocument = await this.populate("user");
  return user;
});

export const Organization = mongoose.model<
  type.OrganizationDocument,
  type.OrganizationModel
>("Organization", OrganizationSchema);
