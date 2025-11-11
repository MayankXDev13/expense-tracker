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
      enum: ["Income", "Expense"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
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
      default: false,
    },
  },
  { timestamps: true }
);

transactionsSchema.pre("save", function (next) {
  this.isActive = this.isRecurring; // true if recurring, false otherwise
  next();
});

export const Transactions = mongoose.model("Transactions", transactionsSchema);
