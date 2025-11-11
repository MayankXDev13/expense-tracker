import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";

export default function HeroSection() {
  const { data: user, isLoading } = useCurrentUser();
  const isLoggedIn = !!user;

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neutral-400/10 blur-3xl rounded-full" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-3xl mx-auto backdrop-blur-sm p-6 sm:p-10 rounded-2xl"
      >
        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6">
          Take Control of Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-gray-400 to-neutral-500">
            Finances
          </span>{" "}
          with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-gray-300 to-gray-400">
            SpendSmart
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-neutral-400 text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          Manage budgets, track expenses, and stay ahead of your financial goals
          — all in a beautiful, intuitive dashboard designed for clarity.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-5"
        >
          {/* Primary Button */}
          <Link to={isLoggedIn ? "/dashboards" : "/signup"}>
            <Button className="relative group bg-neutral-100 text-neutral-900 font-semibold text-lg px-8 py-4 rounded-4xl shadow-lg overflow-hidden transition-all duration-300 hover:bg-neutral-200 active:scale-95">
              <span className="relative z-10">
                {isLoading
                  ? "Loading..."
                  : isLoggedIn
                    ? "Go to Dashboard"
                    : "Get Started"}
              </span>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.15 }}
                className="absolute inset-0 bg-white/40 blur-xl"
              />
            </Button>
          </Link>

          {/* Show Learn More only if logged out */}
          {!isLoggedIn && !isLoading && (
            <Link to="/learn-more">
              <Button className="relative group bg-neutral-100 text-neutral-900 font-semibold text-lg px-8 py-4 rounded-4xl shadow-lg overflow-hidden transition-all duration-300 hover:bg-neutral-200 active:scale-95">
                <span className="relative z-10">Learn More</span>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.15 }}
                  className="absolute inset-0 bg-white/40 blur-xl"
                />
              </Button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
