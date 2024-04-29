/** @format */

import { Response } from "express";
import { AuthorizedRequest } from "@/session";
import { AuthService } from "@/services";
import { ErrorResponse } from "@/utils";

export class AuthController {
  /**
   * Controller's method which logins user.
   * @param req AuthorizedRequest
   * @param res Response
   * @returns Promise<Response>
   */
  public static async login(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Service tries to login user and returns results.
    const { accessToken, refreshToken } = await AuthService.login({
      email: req.body.email.toString(),
      password: req.body.password.toString(),
    });

    // Saves user's refresh token in session.
    req.session.refreshToken = refreshToken;
    return res.status(200).json({ accessToken });
  }

  /**
   * Controller's method which logs out user.
   * @param req AuthorizedRequest
   * @param res Response
   * @returns Promise<Response>
   */
  public static async logout(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Session's cookie options to correctly remove it.
    const cookieOptions = {
      httpOnly: true,
      domain: process.env.SESSION_DOMAIN,
      secure: process.env.SERVER_ENVIRONMENT === "production",
    };

    // Remove user's refresh token from session.
    res.clearCookie("sid", cookieOptions);
    req.session.refreshToken = undefined;
    return res.sendStatus(200);
  }

  /**
   * Controller's method which retrieves user's authentication status.
   * @param req AuthorizedRequest
   * @param res Response
   * @returns Promise<Response>
   */
  public static async status(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, if session has refresh token.
    if (!req.session.refreshToken) {
      return res.sendStatus(200);
    }

    // Refreshes token and validates, to get user's status.
    const { refreshToken } = req.session;
    const { accessToken } = await AuthService.refresh({ refreshToken });
    return res.status(200).json({ accessToken });
  }

  /**
   * Controller's method which refresh access token.
   * @param req AuthorizedRequest
   * @param res Response
   * @returns Promise<Response>
   */
  public static async refresh(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Checks, if session has refresh token.
    if (!req.session.refreshToken) {
      throw new ErrorResponse({ status: 401 });
    }

    // Service tries to re-generate access token.
    const { accessToken } = await AuthService.refresh({
      refreshToken: req.session.refreshToken,
    });
    return res.status(200).json({ accessToken });
  }

  /**
   * Controller's method which handles user's forgotten password.
   * @param req AuthorizedRequest
   * @param res Response
   * @returns Promise<Response>
   */
  public static async forgot(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Service tries to handle forgotten user's password.
    await AuthService.forgot({ email: req.body.email.toString() });
    return res.sendStatus(200);
  }

  /**
   * Controller's method which resets user's password.
   * @param req AuthorizedRequest
   * @param res Response
   * @returns Promise<Response>
   */
  public static async reset(
    req: AuthorizedRequest,
    res: Response
  ): Promise<Response> {
    // Service tries to reset user's password.
    await AuthService.reset({
      email: req.body.email.toString(),
      password: req.body.password.toString(),
      confirmPassword: req.body.confirmPassword.toString(),
      token: req.params.token.toString(),
    });
    return res.sendStatus(200);
  }
}
