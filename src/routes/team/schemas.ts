/** @format */

import mongoose from "mongoose";
import { checkSchema } from "express-validator";

export const CreateSchema = checkSchema({
  organization: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["query"],
  },
  name: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isString: {
      errorMessage: "Name does not match requirements",
    },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "Name should contain between 2 and 64 symbols",
    },
    in: ["body"],
  },
  description: {
    trim: true,
    escape: true,
    isString: {
      errorMessage: "Description does not match requirements",
    },
    isLength: {
      options: { max: 250 },
      errorMessage: "Description should contain between 2 and 250 symbols",
    },
    in: ["body"],
  },
});

export const ViewSchema = checkSchema({
  teamId: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["params"],
  },
});

export const EditSchema = checkSchema({
  teamId: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["params"],
  },
  name: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isString: {
      errorMessage: "Name does not match requirements",
    },
    isLength: {
      options: { min: 2, max: 64 },
      errorMessage: "Name should contain between 2 and 64 symbols",
    },
    in: ["body"],
  },
  description: {
    trim: true,
    escape: true,
    isString: {
      errorMessage: "Description does not match requirements",
    },
    isLength: {
      options: { max: 250 },
      errorMessage: "Description should contain between 2 and 250 symbols",
    },
    in: ["body"],
  },
});

export const ManageTrainersSchema = checkSchema({
  teamId: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["params"],
  },
});

export const ManageAthletesSchema = checkSchema({
  teamId: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["params"],
  },
});

export const EditMembersSchema = checkSchema({
  teamId: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["params"],
  },
  trainers: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isArray: {
      errorMessage: "Bad Request",
    },
    in: ["body"],
  },
  athletes: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isArray: {
      errorMessage: "Bad Request",
    },
    in: ["body"],
  },
});

export const DeleteSchema = checkSchema({
  teamId: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["params"],
  },
});

export const InteractionsSchema = checkSchema({
  teamId: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Bad Request",
    },
    custom: {
      options: (value) => mongoose.isValidObjectId(value),
      errorMessage: "Bad Request",
    },
    in: ["params"],
  },
});
