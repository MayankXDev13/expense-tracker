import mongoose, { Schema } from "mongoose";

const budgetsScheam = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    limitAmount: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      required: true,
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
    },
  },
  { timestamps: true }
);

export const Budgets = mongoose.model("Budgets", budgetsScheam);
