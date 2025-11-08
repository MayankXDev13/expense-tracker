import TransactionManager from "@/components/TransactionManager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/transactions")({
  component: TransactionManager,
});
