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
      options: (organization) => mongoose.isValidObjectId(organization),
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
  birthDate: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isString: {
      errorMessage: "Birth date does not match requirements",
    },
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: "Birth date does not match requirements",
    },
    custom: {
      options: (date) => {
        return !isNaN(new Date(date).getTime());
      },
      errorMessage: "Birth date does not match requirements",
    },
    toDate: true,
    in: ["body"],
  },
  height: {
    trim: true,
    escape: true,
    toFloat: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isFloat: {
      errorMessage: "Height does not match requirements",
    },
    in: ["body"],
  },
  weight: {
    trim: true,
    escape: true,
    toFloat: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isFloat: {
      errorMessage: "Weight does not match requirements",
    },
    in: ["body"],
  },
});

export const ViewSchema = checkSchema({
  athleteId: {
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
  athleteId: {
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

export const EditDataSchema = checkSchema({
  athleteId: {
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
  birthDate: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isString: {
      errorMessage: "Birth date does not match requirements",
    },
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: "Birth date does not match requirements",
    },
    custom: {
      options: (date) => {
        return !isNaN(new Date(date).getTime());
      },
      errorMessage: "Birth date does not match requirements",
    },
    toDate: true,
    in: ["body"],
  },
  height: {
    trim: true,
    escape: true,
    toFloat: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isFloat: {
      errorMessage: "Height does not match requirements",
    },
    in: ["body"],
  },
  weight: {
    trim: true,
    escape: true,
    toFloat: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isFloat: {
      errorMessage: "Weight does not match requirements",
    },
    in: ["body"],
  },
});

export const DeleteSchema = checkSchema({
  athleteId: {
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
