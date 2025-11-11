import mongoose, { Schema } from "mongoose";

const budgetsScheam = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      default: null,
    },
    limitAmount: {
      type: Number,
      required: true,
    },
    isGlobal: {
      type: Boolean,
      default: false,
    },
    period: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly", "quarterly", "annual"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    alertThreshold: {
      type: Number,
      required: true,
    },
    spentAmount: {
      type: Number,
      default: 0,
    },
    isExceeded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Budgets = mongoose.model("Budgets", budgetsScheam);
