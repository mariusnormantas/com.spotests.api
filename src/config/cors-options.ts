/** @format */

import { ErrorResponse } from "@/utils";
import { allowedOrigins } from "./allowed-origins";

// Cors options, how to handle cross-origin requests.
export const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Checks, if origin is in allowed origins array.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    }
    // When origin is not allowed by cors, we should send error response.
    else {
      return callback(
        new ErrorResponse({ status: 403, message: "Not allowed by CORS" })
      );
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
