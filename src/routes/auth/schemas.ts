/** @format */

import { checkSchema } from "express-validator";

export const LoginSchema = checkSchema({
  email: {
    trim: true,
    escape: true,
    normalizeEmail: true,
    notEmpty: {
      errorMessage: {
        message: "Please fill out all required fields",
        status: 400,
      },
    },
    isEmail: {
      errorMessage: {
        message: "Email address does not match requirements",
        status: 400,
      },
    },
    in: ["body"],
  },
  password: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: {
        message: "Please fill out all required fields",
        status: 400,
      },
    },
    isString: {
      errorMessage: {
        message: "Password does not match requirements",
        status: 400,
      },
    },
    isLength: {
      options: { min: 4, max: 127 },
      errorMessage: {
        message: "Password should contain between 4 and 127 symbols",
        status: 400,
      },
    },
    in: ["body"],
  },
});

export const ForgotSchema = checkSchema({
  email: {
    trim: true,
    escape: true,
    normalizeEmail: true,
    notEmpty: {
      errorMessage: {
        message: "Please fill out all required fields",
        status: 400,
      },
    },
    isEmail: {
      errorMessage: {
        message: "Email address does not match requirements",
        status: 400,
      },
    },
    in: ["body"],
  },
});

export const ResetSchema = checkSchema({
  email: {
    trim: true,
    escape: true,
    normalizeEmail: true,
    notEmpty: {
      errorMessage: {
        message: "Please fill out all required fields",
        status: 400,
      },
    },
    isEmail: {
      errorMessage: {
        message: "Email address does not match requirements",
        status: 400,
      },
    },
    in: ["body"],
  },
  password: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: {
        message: "Please fill out all required fields",
        status: 400,
      },
    },
    isString: {
      errorMessage: {
        message: "Password does not match requirements",
        status: 400,
      },
    },
    isLength: {
      options: { min: 4, max: 127 },
      errorMessage: {
        message: "Password should contain between 4 and 127 symbols",
        status: 400,
      },
    },
    custom: {
      options: (value) => /(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value),
      errorMessage: {
        message:
          "Password must contain at least one capital letter, one number, and one symbol",
        status: 400,
      },
    },
    in: ["body"],
  },
  confirmPassword: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: {
        message: "Please fill out all required fields",
        status: 400,
      },
    },
    isString: {
      errorMessage: {
        message: "Password does not match requirements",
        status: 400,
      },
    },
    isLength: {
      options: { min: 4, max: 127 },
      errorMessage: {
        message: "Password should contain between 4 and 127 symbols",
        status: 400,
      },
    },
    in: ["body"],
  },
  token: {
    trim: true,
    escape: true,
    notEmpty: {
      errorMessage: {
        message: "Please fill out all required fields",
        status: 400,
      },
    },
    in: ["params"],
  },
});
