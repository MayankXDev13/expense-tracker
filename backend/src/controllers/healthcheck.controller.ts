import type { Request, Response } from "express";
import logger from "../logger/winston.logger";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  logger.info("Health check passed");
  return res.status(200).json(new ApiResponse(200, {}, "Health check passed"));
});
