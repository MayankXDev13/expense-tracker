import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");

    const accessTokenPayload = { id: user._id, email: user.email };
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN as string;

    const accessToken = jwt.sign(accessTokenPayload, ACCESS_TOKEN, {
      expiresIn: "15m",
    });

    const refreshTokenPayload = { id: user._id };
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;

    const refreshToken = jwt.sign(refreshTokenPayload, REFRESH_TOKEN, {
      expiresIn: "7d",
    });

    await User.findByIdAndUpdate(userId, { refreshToken: refreshToken });
    return { accessToken, refreshToken };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Token generation error:", error);
    throw new ApiError(500, "Error generating tokens");
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, loginType } = req.body;

  if (!username || !email || !password || !loginType) {
    throw new ApiError(
      400,
      "Missing required fields: username, email, password, loginType"
    );
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with given email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    loginType,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Missing required fields: email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.loginType && user.loginType !== "EMAIL_PASSWORD") {
    throw new ApiError(400, `Please login using ${user.loginType} provider`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const tokens = await generateAccessAndRefreshToken(user._id.toString());

  const cookieOptionsRefresh = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const cookieOptionsAccess = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  };

  res.cookie("refreshToken", tokens.refreshToken, cookieOptionsRefresh);
  res.cookie("accessToken", tokens.accessToken, cookieOptionsAccess);

  const userData = {
    id: user._id,
    username: user.username,
    email: user.email,
    currency: user.currency,
    timezone: user.timezone,
    isEmailVerified: user.isEmailVerified,
    loginType: user.loginType,
  };

  const responsePayload = { user: userData, accessToken: tokens.accessToken };

  return res
    .status(200)
    .json(new ApiResponse(200, responsePayload, "Login successful"));
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  const decoded = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN as string
  ) as { id?: string };

  await User.findByIdAndUpdate(decoded.id, { refreshToken: null });

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  return res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token =
    req.body?.refreshToken ||
    req.cookies?.refreshToken ||
    req.headers["x-refresh-token"];

  if (!token || typeof token !== "string") {
    throw new ApiError(400, "Refresh token is required");
  }

  try {
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN as string;
    const payload = jwt.verify(token, REFRESH_TOKEN) as { id?: string };
    const userId = payload?.id;
    if (!userId) throw new ApiError(401, "Invalid refresh token payload");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (!user.refreshToken || user.refreshToken !== token) {
      throw new ApiError(401, "Refresh token mismatch");
    }

    const tokens = await generateAccessAndRefreshToken(userId.toString());

    const cookieOptionsRefresh = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const cookieOptionsAccess = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 15 * 60 * 1000,
    };

    res.cookie("refreshToken", tokens.refreshToken, cookieOptionsRefresh);
    res.cookie("accessToken", tokens.accessToken, cookieOptionsAccess);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: tokens.accessToken },
          "Tokens refreshed successfully"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error("Refresh token error:", error);
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export { registerUser, loginUser, logoutUser, refreshToken, getCurrentUser };
