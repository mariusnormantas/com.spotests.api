/** @format */

import { mailer } from "@/config";
import { SendRegisteredParams, SendResetPasswordParams } from "./types";

export class MailerService {
  private static readonly noReplyAddress = "no-reply@spotests.com";
  private static readonly clientAppUrl = process.env.APP_CLIENT_URL;

  /**
   * Service's method which sends email when a new account been created
   * @param params SendRegisteredParams
   */
  public static sendRegistered(params: SendRegisteredParams) {
    const options = {
      from: MailerService.noReplyAddress,
      to: params.email,
      subject: "You have been registered on Spotests.com",
      template: "registered",
      context: {
        name: params.name,
        url: `${MailerService.clientAppUrl}/reset`,
      },
    };
    mailer.sendMail(options);
  }

  /**
   * Service's method which sends email with reset password link
   * @param params SendResetPasswordParams
   */
  public static sendResetPassword(params: SendResetPasswordParams) {
    const options = {
      from: MailerService.noReplyAddress,
      to: params.email,
      subject: "Reset your password on Spotests.com",
      template: "reset-password",
      context: {
        name: params.name,
        email: params.email,
        url: `${MailerService.clientAppUrl}/reset/${params.reset}`,
      },
    };
    mailer.sendMail(options);
  }
}
