import type { Request, Response } from "express";
import { Category } from "../models/category.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, type } = req.body;

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!name || !type) {
    throw new ApiError(400, "Missing required fields: name, type");
  }

  const category = await Category.create({
    name,
    type,
    userId: user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  const categorys = await Category.find({ userId: user?._id });

  if (!categorys) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, categorys, "Category fetched successfully"));
});

const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, type } = req.body;
  const { id } = req.params;
  const user = req.user;

  if (!name || !type) {
    throw new ApiError(400, "Missing required fields: name, type");
  }

  const category = await Category.findOne({ _id: id, userId: user?._id });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.name = name;
  category.type = type;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!id) {
    throw new ApiError(400, "Missing required fields: id");
  }

  const category = await Category.deleteOne({ _id: id, userId: user?._id });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export { createCategory, getCategory, updateCategory, deleteCategory };
