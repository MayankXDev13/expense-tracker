import mongoose, { Schema } from "mongoose";

export interface User {
  avatar: {
    url: string;
  };
  _id: string;
  username: string;
  email: string;
  password: string;
  currency: string;
  timezone: string;
  loginType: string;
  isEmailVerified: boolean;
  refreshToken: string;
  forgotPasswordToken: string;
  forgotPasswordExpiry: Date;
  emailVerificationToken: string;
  emailVerificationExpiry: Date;
}

const userScheam: Schema<User> = new Schema(
  {
    avatar: {
      type: {
        url: String,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    currency: {
      type: String,
      default: "inr",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    loginType: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userScheam);
