/** @format */

import { PermissionsAction, PermissionsModel, PermissionsRole } from "./types";

export const permissions: Record<
  PermissionsRole,
  Record<PermissionsModel, Array<PermissionsAction>>
> = {
  admin: {
    organization: ["create", "read", "read-all", "edit", "delete"],
    team: ["create", "read", "read-all", "edit", "delete"],
    trainer: ["create", "read", "read-all", "edit", "delete"],
    athlete: ["create", "read", "read-all", "edit", "delete"],
    testing: ["create", "read", "read-all", "edit", "delete"],
  },
  organization: {
    organization: [],
    team: ["create", "read", "read-all", "edit", "delete"],
    trainer: ["create", "read", "read-all", "edit", "delete"],
    athlete: ["create", "read", "read-all", "edit", "delete"],
    testing: ["create", "read", "read-all", "edit", "delete"],
  },
  trainer: {
    organization: [],
    team: ["read", "read-all"],
    trainer: [],
    athlete: ["read", "read-all", "edit"],
    testing: ["create", "read", "read-all", "edit", "delete"],
  },
  athlete: {
    organization: [],
    team: [],
    trainer: [],
    athlete: [],
    testing: ["read", "read-all"],
  },
};
