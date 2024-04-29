/** @format */

import mongoose from "mongoose";
import { checkSchema } from "express-validator";

export const CreateSchema = checkSchema({
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
  teamsLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Teams limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Teams limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
  trainersLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Trainers limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Trainers limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
  athletesLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Athletes limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Athletes limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
  testingsLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Testings limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Testings limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
});

export const ViewSchema = checkSchema({
  organizationId: {
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
  organizationId: {
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

export const EditLockSchema = checkSchema({
  organizationId: {
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
  status: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isBoolean: {
      errorMessage: "Lock status does not match requirements",
    },
    toBoolean: true,
    in: ["body"],
  },
  reason: {
    trim: true,
    escape: true,
    isString: {
      errorMessage: "Lock reason does not match requirements",
    },
    in: ["body"],
  },
});

export const EditLimitsSchema = checkSchema({
  organizationId: {
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
  teamsLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Teams limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Teams limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
  trainersLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Trainers limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Trainers limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
  athletesLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Athletes limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Athletes limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
  testingsLimit: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isInt: {
      options: {
        min: 0,
        max: 9999,
        allow_leading_zeroes: false,
      },
      errorMessage: "Testings limit does not match requirements",
    },
    isLength: {
      options: { min: 0, max: 4 },
      errorMessage: "Testings limit does not match requirements",
    },
    toInt: true,
    in: ["body"],
  },
});

export const InteractionsSchema = checkSchema({
  organizationId: {
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
