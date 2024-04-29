/** @format */

import {
  PermissionsAction,
  PermissionsModel,
  PermissionsRole,
  permissions,
} from "@/config";
import { AccessMiddleware } from "./AccessMiddleware";

export class RoleAccessMiddleware extends AccessMiddleware {
  // Initializes class variables.
  private roleGranted = true;
  private actionGranted = true;

  /**
   * Middleware's method, which checks authenticated user's role.
   * @param roles Array<PermissionsRole>
   * @returns RoleAccessMiddleware
   */
  public roles(roles: Array<PermissionsRole>) {
    if (this.user && !roles.includes(this.user.role)) {
      this.roleGranted = false;
    }
    return this;
  }

  // Middleware's method, which checks user's permission depending on role.
  public action(model: PermissionsModel, actions: Array<PermissionsAction>) {
    if (this.user) {
      // Loops through every passed action and checks if role's permissions includes them.
      const allowedActionsByModel = permissions[this.user.role][model];
      actions.every((action) => {
        if (!allowedActionsByModel.includes(action)) {
          this.actionGranted = false;
        }
        return action;
      });
      return this;
    }
    this.actionGranted = false;
    return this;
  }

  /**
   * Middleware's method, which grants access to resource or blocks.
   */
  public grant() {
    if (!this.roleGranted || !this.actionGranted) {
      throw this.notAllowedException();
    }
    this.next();
  }
}
