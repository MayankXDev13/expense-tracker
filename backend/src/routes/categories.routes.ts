import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categories.controller";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router: Router = Router();

router.use(verifyJWT);

router.route("/").post(createCategory);
router.route("/").get(getCategories);
router.route("/:id").patch(updateCategory);
router.route("/:id").delete(deleteCategory);

export default router;
