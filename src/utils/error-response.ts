/** @format */

import { ErrorResponseParams } from "./types";

/**
 * Class, which sends error response with custom message and defined code.
 */
export class ErrorResponse {
  status: number;
  message: string;

  /**
   * Constructor method for initializing a new instance of the class.
   * @param param0 ErrorResponseParams
   */
  public constructor({
    status = 500,
    message = "Unexpected Error Occurred",
  }: ErrorResponseParams = {}) {
    Error.captureStackTrace(this, this.constructor);
    this.status = status;
    this.message = message;
  }
}
