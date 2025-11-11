import CategoryManager from "@/components/CategoryManager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  component: CategoryManager,
});
