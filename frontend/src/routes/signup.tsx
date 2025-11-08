import SignUpForm from "@/pages/SignUpForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignUpForm,
});
