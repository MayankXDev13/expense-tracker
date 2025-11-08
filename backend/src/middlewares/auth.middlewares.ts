import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import logger from "../logger/winston.logger";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN as string
      ) as { id: string; email: string };

      if (!decodedToken?.id) {
        throw new ApiError(401, "Invalid access token");
      }

      const user = await User.findById(decodedToken.id).select(
        "-password -refreshToken -updatedAt -isEmailVerified -currency -createdAt -timezone -loginType -__v -_id"
      );

      if (!user) {
        throw new ApiError(401, "User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApiError(401, "Invalid access token");
      }

      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Access token has expired");
      }

      throw new ApiError(401, "Authentication failed");
    }
  }
);

export const getLoggedInUserOrIgnore = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return next();
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN as string
      ) as { id: string; email: string };

      if (!decodedToken?.id) {
        return next();
      }

      const user = await User.findById(decodedToken.id).select("-password");

      if (user) {
        req.user = user;
      }

      next();
    } catch (error) {
      next();
    }
  }
);
