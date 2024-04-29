/** @format */

import jwt from "jsonwebtoken";
import { RefreshTokenPayload, User } from "@/models";
import { MailerService } from "@/services";
import { AuthRepository } from "@/repositories";
import { ErrorResponse } from "@/utils";
import * as type from "./types";

export class AuthService {
  /**
   * Service's method, which logins user.
   * @param params LoginParams
   * @returns Promise<LoginData>
   */
  public static async login(params: type.LoginParams): Promise<type.LoginData> {
    return await AuthRepository.login(params);
  }

  /**
   * Service's method, which refresh user's access token.
   * @param params RefreshParams
   * @returns Promise<RefreshData>
   */
  public static async refresh(
    params: type.RefreshParams
  ): Promise<type.RefreshData> {
    // Checks, if access token's secret and token exists.
    // const { refreshToken } = params;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
      throw new ErrorResponse({ status: 401 });
    }

    // Initializes new access token and verifies refresh token which is saved in session on server side.
    return new Promise((resolve, reject) => {
      jwt.verify(
        params.refreshToken,
        refreshTokenSecret,
        async (error, decoded) => {
          if (error) {
            return reject(new ErrorResponse({ status: 401 }));
          }
          const payload = decoded as RefreshTokenPayload;
          const user = await User.findById(payload._id);
          if (!user) {
            return resolve({ accessToken: undefined });
          }
          const accessToken = user.signAccessToken();
          return resolve({ accessToken });
        }
      );
    });
  }

  /**
   * Service's method, which generates reset password token and sends email.
   * @param params ForgotParams
   * @returns Promise<ForgotData>
   */
  public static async forgot(
    params: type.ForgotParams
  ): Promise<type.ForgotData> {
    const { user, token } = await AuthRepository.forgot(params);

    // Sends email with reset password link, when user's reset token exists.
    MailerService.sendResetPassword({
      email: user.email,
      name: user.name,
      reset: token,
    });
  }

  /**
   * Service's method, which resets user's password based on token validation.
   * @param params ResetParams
   * @returns Promise<ResetData>
   */
  public static async reset(params: type.ResetParams): Promise<type.ResetData> {
    await AuthRepository.reset(params);
  }
}
