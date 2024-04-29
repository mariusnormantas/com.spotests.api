/** @format */

import { OrganizationRepository } from "@/repositories";
import { MailerService } from "../mailer";
import * as type from "./types";

export class OrganizationService {
  /**
   * Service's method, which creates organization and assigns user at the same time.
   * @param params CreateParams
   * @returns Promise<OrganizationDocument>
   */
  public static async create(
    params: type.CreateParams
  ): Promise<type.CreateData> {
    const results = await OrganizationRepository.create(params);

    // Sends email to notify registration.
    MailerService.sendRegistered({
      email: results.user.email,
      name: results.user.name,
    });
    return results;
  }

  /**
   * Service's method, which retrieves list of paginated organizations.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing(
    params: type.ListingParams
  ): Promise<type.ListingData> {
    return await OrganizationRepository.listing(params);
  }

  /**
   * Service's method, which retrieves view's data of organization.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    return await OrganizationRepository.view(params);
  }

  /**
   * Service's method, which updates organization user's data.
   * @param params EditAccountParams
   * @returns Promise<EditAccountData>
   */
  public static async editAccount(
    params: type.EditAccountParams
  ): Promise<type.EditAccountData> {
    return await OrganizationRepository.editAccount(params);
  }

  /*
   * Service's method, which updates organization user's lock status.
   * @param params LockParams
   * @returns Promise<LockData>
   */
  public static async lock(params: type.LockParams): Promise<type.LockData> {
    return await OrganizationRepository.lock(params);
  }

  /**
   * Service's method, which updates organization's limits.
   * @param params ViewParams
   */
  public static async limits(
    params: type.LimitsParams
  ): Promise<type.LimitsData> {
    return await OrganizationRepository.limits(params);
  }

  /**
   * Method, which retrieves list of interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    return await OrganizationRepository.interactions(params);
  }
}
