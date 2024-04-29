/** @format */

import mongoose from "mongoose";
import { Organization, Trainer } from "@/models";
import { AccessMiddleware } from "./AccessMiddleware";

export class AccessTrainerMiddleware extends AccessMiddleware {
  // Initializes class variables.
  protected accessGranted = false;

  /**
   * Middleware's method, which runs, when admin is requesting data.
   */
  protected async adminAccessingEntity() {
    this.accessGranted = true;
  }

  /**
   * Middleware's method, which runs, when organization is requesting data.
   */
  protected async organizationAccessingEntity() {
    const organization = await Organization.exists({
      user: this.user?._id,
    }).lean();
    if (organization) {
      // Setups request query organization's ID.
      this.req.query.organization = organization._id;
      this.accessGranted = true;

      if (this.req.params.trainerId) {
        const trainer = await Trainer.exists({
          _id: new mongoose.Types.ObjectId(this.req.params.trainerId),
          organization: organization._id,
        }).lean();

        if (!trainer) {
          this.accessGranted = false;
        }
      }
    }
  }

  /**
   * Middleware's method, which grants access to resource or blocks.
   */
  public grant() {
    if (!this.accessGranted) {
      throw this.notAllowedException();
    }
    this.next();
  }
}
