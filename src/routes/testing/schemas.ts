/** @format */

import mongoose from "mongoose";
import { checkSchema } from "express-validator";

export const CreateSchema = checkSchema({
  "athlete": {
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
  "date": {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isString: {
      errorMessage: "Date does not match requirements",
    },
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: "Date does not match requirements",
    },
    custom: {
      options: (date) => {
        return !isNaN(new Date(date).getTime());
      },
      errorMessage: "Date does not match requirements",
    },
    toDate: true,
    in: ["body"],
  },
  "data.*": {
    trim: true,
    escape: true,
    toFloat: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    isFloat: {
      errorMessage: "Values does not match requirements",
    },
    in: ["body"],
  },
});

export const SummarySchema = checkSchema({
  athlete: {
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
  testings: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: "Please fill out all required fields",
    },
    custom: {
      options: (testings) => {
        const arrayOfTestings = testings.split(",");
        if (arrayOfTestings.length < 1 || arrayOfTestings.length > 3) {
          throw new Error("Testings does not match requirements");
        }
        for (const testing of arrayOfTestings) {
          if (!mongoose.isValidObjectId(new mongoose.Types.ObjectId(testing))) {
            throw new Error("Testings does not match requirements");
          }
        }
        return true;
      },
    },
    in: ["query"],
  },
});

export const DeleteSchema = checkSchema({
  testingId: {
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
