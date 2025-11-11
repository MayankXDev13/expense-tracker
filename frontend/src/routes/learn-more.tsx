import LearnMore from "@/components/learnMore/LearnMore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learn-more")({
  component: LearnMore,
});
