import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router: Router = Router();

router.use(verifyJWT);

router.route("/").get(getCategory).post(createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .delete(deleteCategory)
  .patch(updateCategory);

export default router;
