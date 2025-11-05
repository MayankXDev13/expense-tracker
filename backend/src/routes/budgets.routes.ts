import { Router } from "express";
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  getBudgets,
  updateBudget,
} from "../controllers/budgets.controller";
import { verifyJWT } from "../middlewares/auth.middlewares";

const router: Router = Router();

router.use(verifyJWT);

router.route("/").post(createBudget).get(getBudgets);
router.route("/:id").get(getBudgetById).put(updateBudget).delete(deleteBudget);

export default router;
