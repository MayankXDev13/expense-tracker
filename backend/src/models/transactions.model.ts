import mongoose, { Schema } from "mongoose";

const transactionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Transactions = mongoose.model("Transactions", transactionsSchema);
