/** @format */

import { Request } from "express";
import { Session, SessionData } from "express-session";
import { AccessTokenPayload } from "@/models";

export interface AuthorizedSession extends SessionData {
  refreshToken?: string;
}

export interface AuthorizedRequest extends Request {
  session: AuthorizedSession & Session;
  user?: AccessTokenPayload;
}
