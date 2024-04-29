/** @format */

import { TeamRepository } from "@/repositories";
import * as type from "./types";

export class TeamService {
  /**
   * Service's method, which creates team and assigns to organization.
   * @param params CreateParams
   * @returns Promise<CreateData>
   */
  public static async create(
    params: type.CreateParams
  ): Promise<type.CreateData> {
    return await TeamRepository.create(params);
  }

  /**
   * Service's method, which retrieves list of paginated teams.
   * @param params ListingParams
   * @returns Promise<ListingData>
   */
  public static async listing({
    pagination,
    filters,
  }: type.ListingParams): Promise<type.ListingData> {
    return await TeamRepository.listing({ pagination, filters });
  }

  /**
   * Service's method, which retrieves information of team.
   * @param params ViewParams
   * @returns Promise<ViewData>
   */
  public static async view(params: type.ViewParams): Promise<type.ViewData> {
    return await TeamRepository.view(params);
  }

  /**
   * Service's method, which updates team's data.
   * @param params EditParams
   * @returns Promise<EditData>
   */
  public static async edit(params: type.EditParams): Promise<type.EditData> {
    return await TeamRepository.edit(params);
  }

  /**
   * Service's method, which retrieves management list of paginated trainers.
   * @param params ManageTrainersListingParams
   * @returns Promise<ManageTrainersListingData>
   */
  public static async manageTrainersListing({
    pagination,
    filters,
  }: type.ManageTrainersListingParams): Promise<type.ManageTrainersListingData> {
    return await TeamRepository.manageTrainersListing({ pagination, filters });
  }

  /**
   * Service's method, which retrieves management list of paginated athletes.
   * @param params ManageTrainersListingParams
   * @returns Promise<ManageTrainersListingData>
   */
  public static async manageAthletesListing({
    pagination,
    filters,
  }: type.ManageAthletesListingParams): Promise<type.ManageAthletesListingData> {
    return await TeamRepository.manageAthletesListing({ pagination, filters });
  }

  /**
   * Service's method, which updates team's information.
   * @param params EditMembersParams
   * @returns Promise<EditMembersData>
   */
  public static async editMembers(
    params: type.EditMembersParams
  ): Promise<type.EditMembersData> {
    return await TeamRepository.editMembers(params);
  }

  /**
   * Service's method, which deletes team.
   * @param params DeleteParams
   * @returns Promise<DeleteData>
   */
  public static async delete(
    params: type.DeleteParams
  ): Promise<type.DeleteData> {
    return await TeamRepository.delete(params);
  }
  /**
   * Service's method, which retrieves list of interactions.
   * @param params InteractionsParams
   * @returns Promise<InteractionsData>
   */
  public static async interactions(
    params: type.InteractionsParams
  ): Promise<type.InteractionsData> {
    return await TeamRepository.interactions(params);
  }
}
