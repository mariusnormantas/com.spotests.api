/** @format */

import crypto from "crypto";
import { Athlete, Organization, Trainer, User } from "@/models";
import { ErrorResponse } from "@/utils";
import * as type from "./types";

export class AuthRepository {
  /**
   * Repository's method, which logins user.
   * @param params LoginParams
   * @returns Promise<LoginData>
   */
  public static async login(params: type.LoginParams): Promise<type.LoginData> {
    // Retrieves target user.
    const user = await User.findOne({ email: params.email }, ["+password"]);

    if (!user) {
      throw new ErrorResponse({
        status: 400,
        message: "Email address or password is incorrect",
      });
    }
    // Checks, if password is not correct or user is locked.
    const isCorrectPassword = await user.comparePasswords(params.password);
    if (!isCorrectPassword || user.locked) {
      throw new ErrorResponse({
        status: 400,
        message: "Email address or password is incorrect",
      });
    }

    // Trainers and athletes should be checked, if their organization is not locked.
    if (user.role === "trainer" || user.role === "athlete") {
      // User's model, which depends on role.
      let roleModel = null;

      // Lookups for user's organization, when user's role is trainer or athlete.
      switch (user.role) {
        case "trainer":
          roleModel = await Trainer.findOne({ user: user._id }, [
            "organization",
          ]).lean();
          break;
        case "athlete":
          roleModel = await Athlete.findOne({ user: user._id }, [
            "organization",
          ]).lean();
          break;
      }

      // Checks, if user's role is trainer or athlete, but model was not found and exists.
      if (!roleModel) {
        throw new ErrorResponse({
          status: 400,
          message: "Email address or password is incorrect",
        });
      }

      // When user's role is trainer or athlete, we should check organization's lock status.
      const organization = await Organization.findById(roleModel.organization);

      // Checks, if organization exists and model is assigned to one.
      if (!organization) {
        throw new ErrorResponse({
          status: 400,
          message: "Email address or password is incorrect",
        });
      }

      // Retrieves organization user's lock status.
      const isOrganizationLocked = (await organization.getUser()).locked;
      if (isOrganizationLocked) {
        throw new ErrorResponse({
          status: 403,
          message: "Account is currently locked",
        });
      }
    }

    // When user is successfully authenticated, we should generate refresh token.
    const refreshToken = user.signRefreshToken();
    const accessToken = user.signAccessToken();
    return { refreshToken, accessToken };
  }

  /**
   * Repository's method, which generates reset password token and sends email.
   * @param params ForgotParams
   * @returns Promise<ForgotData>
   */
  public static async forgot(
    params: type.ForgotParams
  ): Promise<type.ForgotData> {
    // Generates reset token for user.
    const reset = crypto.randomBytes(20).toString("hex");

    // Retrieves user by email from database and updates reset token.
    const user = await User.findOneAndUpdate({ email: params.email }, { reset })
      .select(["-_id", "name", "email", "reset"])
      .lean();

    // Throws error, when user is not updated and retrieved.
    if (!user) {
      throw new ErrorResponse({
        status: 404,
        message: "Sorry, password can not be updated",
      });
    }
    return { user, token: reset };
  }

  /**
   * Repository's method, which resets user's password based on token validation.
   * @param params ResetParams
   * @returns Promise<ResetData>
   */
  public static async reset(params: type.ResetParams): Promise<type.ResetData> {
    // Retrieves user by email and token from database.
    const user = await User.findOne({
      email: params.email,
      reset: params.token,
    });

    // Checks, if target user exists.
    if (!user || params.password !== params.confirmPassword) {
      throw new ErrorResponse({
        message: "Sorry, password can not be updated",
      });
    }

    // Checks, if user is not verified when resetting password.
    if (!user.verifiedAt) {
      user.verifiedAt = new Date();
    }

    // Updates user's password.
    user.reset = null;
    user.password = params.password;
    await user.save();
  }
}
