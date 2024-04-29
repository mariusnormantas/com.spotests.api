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
  email: {
    trim: true,
    escape: true,
    normalizeEmail: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isEmail: {
      errorMessage: "Email address does not match requirements",
    },
    in: ["body"],
  },
});

export const ViewSchema = checkSchema({
  trainerId: {
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

export const EditAccountSchema = checkSchema({
  trainerId: {
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
  email: {
    trim: true,
    escape: true,
    normalizeEmail: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isEmail: {
      errorMessage: "Email address does not match requirements",
    },
    in: ["body"],
  },
});

export const DeleteSchema = checkSchema({
  trainerId: {
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
  trainerId: {
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
