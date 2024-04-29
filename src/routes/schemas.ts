/** @format */

import { ErrorResponse } from "@/utils";
import { checkSchema } from "express-validator";

export const PaginationSchema = checkSchema({
  page: {
    escape: true,
    trim: true,
    notEmpty: true,
    isInt: true,
    toInt: true,
    custom: {
      options: (page) => {
        if (parseInt(page) < 1 || parseInt(page) > 9999) {
          throw new ErrorResponse({ message: "Bad Request" });
        }
        return true;
      },
    },
    errorMessage: "Bad Request",
    in: ["query"],
  },
  limit: {
    escape: true,
    trim: true,
    notEmpty: true,
    isInt: true,
    toInt: true,
    custom: {
      options: (limit) => {
        if (parseInt(limit) < 1 || parseInt(limit) > 9999) {
          throw new ErrorResponse({ message: "Bad Request" });
        }
        return true;
      },
    },
    errorMessage: "Bad Request",
    in: ["query"],
  },
});

export const SearchSchema = checkSchema({
  search: {
    escape: true,
    trim: true,
    isString: true,
    optional: true,
    errorMessage: "Bad Request",
    in: ["query"],
  },
});
