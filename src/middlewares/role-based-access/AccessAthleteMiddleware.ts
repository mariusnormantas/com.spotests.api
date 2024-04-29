/** @format */

import mongoose from "mongoose";
import { Athlete, Organization, Team, Trainer } from "@/models";
import { AccessMiddleware } from "./AccessMiddleware";

export class AccessAthleteMiddleware extends AccessMiddleware {
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

      if (this.req.params.athleteId) {
        const athlete = await Athlete.exists({
          _id: new mongoose.Types.ObjectId(this.req.params.athleteId),
          organization: organization._id,
        }).lean();

        if (!athlete) {
          this.accessGranted = false;
        }
      }
    }
  }

  /**
   * Middleware's method, which runs, when trainer is requesting data.
   */
  protected async trainerAccessingEntity() {
    const trainer = await Trainer.exists({
      user: this.user?._id,
    }).lean();
    if (trainer) {
      // Setups request query trainer's ID.
      this.req.query.trainer = trainer._id;
      this.accessGranted = true;

      if (this.req.params.athleteId) {
        const team = await Team.exists({
          trainers: { $in: [trainer._id] },
          athletes: {
            $in: [new mongoose.Types.ObjectId(this.req.params.athleteId)],
          },
        }).lean();

        if (!team) {
          this.accessGranted = false;
        }
      }
    }
  }

  /**
   * Middleware's method, which runs, when athlete is requesting data.
   */
  protected async athleteAccessingEntity() {
    const athlete = await Athlete.exists({
      user: this.user?._id,
    }).lean();
    if (athlete) {
      // Setups request query athlete's ID.
      this.req.query.athlete = athlete._id;
      this.accessGranted = true;

      // The maximum of accessible data for athlete is itself's data.
      if (this.req.params.athleteId) {
        if (athlete._id !== this.req.params.athleteId) {
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
