/** @format */

import { AthleteRepository } from "@/repositories";
import { MailerService } from "../mailer";
import * as type from "./types";

export class AthleteService {
  /**
   * Service's method, which creates athlete and assigns to organization.
   * @param params CreateParams
   * @returns Promise<CreateData>
   */
  public static async create(
    params: type.CreateParams
  ): Promise<type.CreateData> {
    const athlete = await AthleteRepository.create(params);

    // Sends email to notify registration.
    MailerService.sendRegistered({
      email: params.email,
      name: params.name,
    });
    return athlete;
  }

  /**
   * Service's method, which retrieves list of paginated athletes.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing(
    params: type.ListingParams
  ): Promise<type.ListingData> {
    return await AthleteRepository.listing(params);
  }

  /**
   * Service's method, which retrieves data of athlete.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    return await AthleteRepository.view(params);
  }

  /**
   * Service's method, which updates athlete's account.
   * @param params EditAccountParams
   * @returns EditAccountData
   */
  public static async editAccount(
    params: type.EditAccountParams
  ): Promise<type.EditAccountData> {
    return await AthleteRepository.editAccount(params);
  }

  /**
   * Service's method, which updates athlete's information.
   * @param params EditDataParams
   * @returns EditDataData
   */
  public static async editData(
    params: type.EditDataParams
  ): Promise<type.EditDataData> {
    return await AthleteRepository.editData(params);
  }

  /**
   * Service's method, which deletes athlete.
   * @param params DeleteParams
   * @returns DeleteData
   */
  public static async delete(
    params: type.DeleteParams
  ): Promise<type.DeleteData> {
    return await AthleteRepository.delete(params);
  }

  /**
   * Service's method, which retrieves list of athlete's interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    return await AthleteRepository.interactions(params);
  }
}
