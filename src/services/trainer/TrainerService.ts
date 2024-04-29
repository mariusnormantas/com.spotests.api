/** @format */

import { TrainerRepository } from "@/repositories";
import { MailerService } from "../mailer";
import * as type from "./types";

export class TrainerService {
  /**
   * Service's method, which creates trainer and assigns to organization.
   * @param params CreateParams
   * @returns Promise<TrainerDocument>
   */
  public static async create(
    params: type.CreateParams
  ): Promise<type.CreateData> {
    const trainer = await TrainerRepository.create(params);

    // Sends email to notify registration.
    MailerService.sendRegistered({
      email: params.email,
      name: params.name,
    });
    return trainer;
  }

  /**
   * Service's method, which retrieves paginated list of trainers.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing({
    pagination,
    filters,
  }: type.ListingParams): Promise<type.ListingData> {
    return await TrainerRepository.listing({ pagination, filters });
  }

  /**
   * Service's method, which retrieves data of trainer.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    return await TrainerRepository.view(params);
  }

  /**
   * Method, which updates trainer's user.
   * @param params EditAccountParams
   * @returns Promise<EditAccountData>
   */
  public static async editAccount(
    params: type.EditAccountParams
  ): Promise<type.EditAccountData> {
    return await TrainerRepository.editAccount(params);
  }

  /**
   * Service's method, which deletes trainer.
   * @param params DeleteParams
   * @returns Promise<DeleteData>
   */
  public static async delete(
    params: type.DeleteParams
  ): Promise<type.DeleteData> {
    return await TrainerRepository.delete(params);
  }

  /**
   * Service's method, which retrieves list of interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    return await TrainerRepository.interactions(params);
  }
}
