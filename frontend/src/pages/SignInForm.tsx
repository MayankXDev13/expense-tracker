import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSignIn } from "@/hooks/useSignIn";




const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const { mutate: signIn, isPending, error } = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormValues) => {
    signIn(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen bg-neutral-950 text-neutral-100"
    >
      <Card className="bg-neutral-900 border border-neutral-800 shadow-xl w-full max-w-md">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Sign In to SpendSmart
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input
                placeholder="Email"
                type="email"
                {...register("email")}
                className="bg-neutral-800 border-neutral-700 text-neutral-100"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Password"
                type="password"
                {...register("password")}
                className="bg-neutral-800 border-neutral-700 text-neutral-100"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-center text-sm">
                {error.message || "Invalid credentials"}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-neutral-100 text-neutral-900 font-medium hover:bg-neutral-200 transition-all duration-300"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
