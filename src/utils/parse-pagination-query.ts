/** @format */

import { Request } from "express";

export const parsePaginationQuery = (req: Request) => {
  return {
    page: parseInt(req.query.page as string) ?? 1,
    limit: parseInt(req.query.limit as string) ?? 20,
  };
};
