import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categories.controller";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router: Router = Router();

router.route("/").post(verifyJWT, createCategory);
router.route("/").get(verifyJWT, getCategories);
router.route("/:id").patch(verifyJWT, updateCategory);
router.route("/:id").delete(verifyJWT, deleteCategory);

export default router;
