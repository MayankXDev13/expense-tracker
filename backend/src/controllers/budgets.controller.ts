import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Budgets } from "../models/budgets.models";
import { Categories } from "../models/categories.model";
import { ApiResponse } from "../utils/ApiResponse";

const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const {
    categoryId,
    limitAmount,
    period,
    startDate,
    endDate,
    alertThreshold,
  } = req.body;

  if (!categoryId || !limitAmount || !period || !startDate) {
    throw new ApiError(
      400,
      "Missing required fields: category, limitAmount, period, startDate"
    );
  }
  const category = Categories.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const budget = await Budgets.create({
    userId: user?._id,
    category: categoryId,
    limitAmount,
    period,
    startDate,
    endDate,
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

export { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget };
