import SignInForm from "@/pages/SignInForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: SignInForm,
});
