import BudgetManager from "@/components/BudgetManager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/budgets")({
  component: BudgetManager,
});
