/** @format */

import { UserRole } from "@/models";

export type PermissionsRole = UserRole;

export type PermissionsAction =
  | "create"
  | "read"
  | "read-all"
  | "edit"
  | "delete";

export type PermissionsModel =
  | "organization"
  | "team"
  | "trainer"
  | "athlete"
  | "testing";
