import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import {
  createTransaction,
  deleteTransaction,
  getTrasactionById,
  getTrasactions,
  updateTrasaction,
} from "../controllers/transactions.controller";

const router: Router = Router();

router.use(verifyJWT);

router.route("/").post(createTransaction);
router.route("/").get(getTrasactions);
router.route("/:id").get(getTrasactionById);
router.route("/:id").put(updateTrasaction);
router.route("/:id").delete(deleteTransaction);

export default router;
