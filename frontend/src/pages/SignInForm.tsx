import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useSignIn } from "@/hooks/useSignIn";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNavigate } from "@tanstack/react-router";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const { mutate: signIn, isPending, error } = useSignIn();
  const [showPassword, setShowPassword] = useState(false);

  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  if (user) {
    navigate({ to: "/" });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormValues) => signIn(data);

  const errorMessage =
    (error as { message?: string })?.message || "Invalid credentials";

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-950 text-neutral-100 px-4">
      <Card className="bg-neutral-900 border border-neutral-800 shadow-2xl w-full max-w-md rounded-2xl transition-transform duration-200 hover:scale-[1.01]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold tracking-tight text-neutral-100">
            SpendSmart
          </CardTitle>
          <p className="text-sm text-neutral-400">Sign in to your account</p>
        </CardHeader>

        <Separator className="bg-neutral-800" />

        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Input
                placeholder="Email"
                type="email"
                {...register("email")}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition-all duration-200"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    className="text-red-400 text-sm"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2 relative">
              <Input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 transition-all duration-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>

              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    className="text-red-400 text-sm"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-400 text-center text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-neutral-100 text-neutral-900 font-medium my-1 hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 rounded-lg"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center text-sm border-t border-neutral-800 pt-4">
          <p className="text-neutral-400">Don’t have an account?</p>
          <a
            href="/signup"
            className="font-semibold text-neutral-50 hover:underline hover:text-neutral-300 transition-colors"
          >
            Create an account
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
