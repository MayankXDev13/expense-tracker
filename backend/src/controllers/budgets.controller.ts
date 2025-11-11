import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Budgets } from "../models/budgets.models";
import { Category } from "../models/category.model";
import { ApiResponse } from "../utils/ApiResponse";
import { Transactions } from "../models/transactions.model";
import type { ITransaction } from "../types/transaction.types";

const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const {
    categoryId,
    limitAmount,
    period,
    startDate,
    endDate,
    alertThreshold,
    isGlobal,
  } = req.body;

  if (!limitAmount || !period || !startDate) {
    throw new ApiError(
      400,
      "Missing required fields: limitAmount, period, startDate"
    );
  }

  if (!isGlobal && !categoryId) {
    throw new ApiError(400, "Category ID is required for category budgets");
  }

  if (!isGlobal && categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  }

  let computedEndDate = endDate ? new Date(endDate) : new Date(startDate);
  const sDate = new Date(startDate);

  if (!endDate) {
    if (period === "monthly") computedEndDate.setMonth(sDate.getMonth() + 1);
    else if (period === "weekly") computedEndDate.setDate(sDate.getDate() + 7);
    else if (period === "yearly")
      computedEndDate.setFullYear(sDate.getFullYear() + 1);
  }

  const existingBudget = await Budgets.findOne({
    userId: user?._id,
    isGlobal: !!isGlobal,
    ...(categoryId && { categoryId }),
    startDate: { $lte: new Date(computedEndDate) },
    endDate: { $gte: new Date(startDate) },
  });

  if (existingBudget) {
    throw new ApiError(
      400,
      isGlobal
        ? "A global budget already exists for this period."
        : "A budget for this category already exists for this period."
    );
  }

  const budget = await Budgets.create({
    userId: user?._id,
    categoryId: isGlobal ? null : categoryId,
    isGlobal: !!isGlobal,
    limitAmount,
    period,
    startDate,
    endDate: computedEndDate,
    alertThreshold,
  });

  if (!budget) {
    throw new ApiError(400, "Budget not created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, budget, "Budget created successfully"));
});

const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  const budgets = await Budgets.find({ userId: user?._id });
  return res
    .status(200)
    .json(new ApiResponse(200, budgets, "Budgets fetched successfully"));
});

const getBudgetById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const budget = await Budgets.findOne({ _id: id, userId: user?._id }).populate(
    "category",
    "name type"
  );
  if (!budget) throw new ApiError(404, "Budget not found");

  return res
    .status(200)
    .json(new ApiResponse(200, budget, "Budget fetched successfully"));
});

const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;
  const {
    categoryId,
    limitAmount,
    period,
    startDate,
    endDate,
    alertThreshold,
  } = req.body;

  const updatedBudget = await Budgets.findByIdAndUpdate(
    { _id: id, userId: user?._id },
    {
      category: categoryId,
      limitAmount,
      period,
      startDate,
      endDate,
      alertThreshold,
    }
  );

  if (!updateBudget) {
    throw new ApiError(404, "Budget not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBudget, "Budget updated successfully"));
});

const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const { id } = req.params;

  const deletedBudget = await Budgets.deleteOne({ _id: id, userId: user?._id });

  if (!deleteBudget) throw new ApiError(404, "Budget not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Budget deleted successfully"));
});

const updateBudgetOnTransaction = async (transaction: ITransaction) => {
  try {
    if (transaction.type !== "Expense") return; // only process expenses

    const now = new Date();

    // find global budgets and category budgets if categoryId exists
    const query: any = {
      userId: transaction.userId,
      startDate: { $lte: now },
      endDate: { $gte: now },
    };

    if (transaction.categoryId) {
      query.$or = [{ isGlobal: true }, { categoryId: transaction.categoryId }];
    } else {
      query.isGlobal = true; // only global budgets apply if no category
    }

    const budgets = await Budgets.find(query);
    if (!budgets.length) return;

    for (const budget of budgets) {
      const matchQuery: any = {
        userId: transaction.userId,
        type: "Expense",
        createdAt: { $gte: budget.startDate, $lte: budget.endDate },
      };

      if (!budget.isGlobal && transaction.categoryId) {
        matchQuery.categoryId = budget.categoryId;
      }

      const totalSpent = await Transactions.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const spent = totalSpent.length ? totalSpent[0].total : 0;
      budget.spentAmount = spent;
      budget.isExceeded = spent > budget.limitAmount;
      await budget.save();

      const percentage = (spent / budget.limitAmount) * 100;
      if (percentage >= budget.alertThreshold && !budget.isExceeded) {
        console.log(
          `⚠️ ${
            budget.isGlobal ? "Global" : "Category"
          } budget at ${percentage.toFixed(1)}%`
        );
      }
    }
  } catch (err: any) {
    console.error("Budget update error:", err.message);
  }
};

export {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  updateBudgetOnTransaction,
};
