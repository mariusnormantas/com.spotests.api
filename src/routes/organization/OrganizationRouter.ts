/** @format */

import { OrganizationController } from "@/controllers";
import Router from "../Router";
import * as schema from "./schemas";

export class OrganizationRouter extends Router {
  /**
   * Method, which initializes admin endpoints when instance is created.
   */
  protected admin() {
    this.Admin.post(
      "/v1/create",
      schema.CreateSchema,
      this.validate,
      OrganizationController.create
    );
    this.Admin.get(
      "/v1/listing",
      this.schema.PaginationSchema,
      this.schema.SearchSchema,
      this.validate,
      OrganizationController.listing
    );
    this.Admin.get(
      "/v1/:organizationId/view",
      schema.ViewSchema,
      this.validate,
      OrganizationController.view
    );
    this.Admin.put(
      "/v1/:organizationId/edit-account",
      schema.EditAccountSchema,
      this.validate,
      OrganizationController.editAccount
    );
    this.Admin.put(
      "/v1/:organizationId/edit-lock",
      schema.EditLockSchema,
      this.validate,
      OrganizationController.lock
    );
    this.Admin.put(
      "/v1/:organizationId/edit-limits",
      schema.EditLimitsSchema,
      this.validate,
      OrganizationController.limits
    );
    this.Admin.get(
      "/v1/:organizationId/interactions",
      schema.InteractionsSchema,
      this.schema.PaginationSchema,
      this.validate,
      OrganizationController.interactions
    );
  }
}
