import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router: Router = Router();

router.use(verifyJWT);

router.route("/").post(createCategory);
router.route("/").get(getCategory);
router.route("/:id").patch(updateCategory);
router.route("/:id").delete(deleteCategory);

export default router;
