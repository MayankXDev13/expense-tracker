import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Transactions } from "../models/transactions.model";
import { Category } from "../models/category.model";
import { ApiResponse } from "../utils/ApiResponse";
import { updateBudgetOnTransaction } from "./budgets.controller";
import type { ITransaction } from "../types/transaction.types";
const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const {
    amount,
    type,
    category,
    description,
    isRecurring,
    frequency,
    startDate,
    endDate,
  } = req.body;
  const user = req.user;

  if (category) {
    const categorys = await Category.findById(category);
    if (!categorys) {
      throw new ApiError(404, "Category not found");
    }
  }

  const transaction = await Transactions.create({
    amount,
    type,
    categoryId: category,
    description,
    isRecurring,
    frequency,
    startDate,
    endDate,
    userId: user?._id,
  });

  if (!transaction) {
    throw new ApiError(400, "Transaction not created");
  }

  // update budeget
  await updateBudgetOnTransaction(transaction as ITransaction);

  return res
    .status(201)
    .json(
      new ApiResponse(201, transaction, "Transaction created successfully")
    );
});

const getTrasactions = asyncHandler(async (req: Request, res: Response) => {
  const { type, category, isActive } = req.query;
  const user = req.user;

  const filter = {} as {
    userId?: string;
    type?: string;
    category?: string;
    isActive?: boolean;
  };
  filter.userId = user?._id;
  if (type) filter.type = type as string;
  if (category) filter.category = category as string;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const transactions = await Transactions.find(filter)
    .populate("categoryId", "name type")
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  if (!transactions) {
    throw new ApiError(404, "Transactions not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "Transactions fetched successfully")
    );
});

const getTrasactionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (!id) {
    throw new ApiError(400, "Missing required fields: id");
  }
  const transaction = await Transactions.findOne({
    _id: id,
    userId: user?._id,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, transaction, "Transaction fetched successfully")
    );
});

const updateTrasaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const {
    amount,
    type,
    category,
    description,
    isRecurring,
    frequency,
    startDate,
    endDate,
  } = req.body;

  const transaction = await Transactions.findOne({
    _id: id,
    userId: user?._id,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  // Check if switching from normal => recurring
  if (!transaction.isRecurring && isRecurring === true) {
    if (!frequency || !startDate || !endDate) {
      throw new ApiError(
        400,
        "Missing required fields for recurring transaction: frequency, startDate, endDate"
      );
    }

    transaction.isRecurring = true;
    transaction.isActive = true;
    transaction.frequency = frequency;
    transaction.startDate = startDate;
    transaction.endDate = endDate;
  }
  // Check if switching from recurring => normal
  else if (transaction.isRecurring && isRecurring === false) {
    transaction.isRecurring = false;
    transaction.isActive = false;

    // Remove recurring-specific fields
    transaction.frequency = undefined;
    transaction.startDate = undefined;
    transaction.endDate = undefined;
  }

  // Update common fields for all cases (moved outside conditionals)
  if (amount !== undefined) transaction.amount = amount;
  if (type) transaction.type = type;
  if (category) transaction.categoryId = category;
  if (description) transaction.description = description;
  if (isRecurring !== undefined) transaction.isRecurring = isRecurring;

  await transaction.save();

  const updatedTransaction = await Transactions.findOne({
    _id: transaction._id,
    userId: user?._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedTransaction,
        "Transaction updated successfully"
      )
    );
});

const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!id) {
    throw new ApiError(400, "Missing required fields: id");
  }

  const deletedTransaction = await Transactions.deleteOne({
    _id: id,
    userId: user?._id,
  });
  if (!deletedTransaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Transaction deleted successfully"));
});

export {
  createTransaction,
  getTrasactions,
  getTrasactionById,
  updateTrasaction,
  deleteTransaction,
};
