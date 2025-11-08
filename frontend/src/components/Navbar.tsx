import { motion } from "framer-motion";
import { Link, useRouter } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: user, isLoading} = useCurrentUser();
  const router = useRouter();

  const isLoggedIn = !!user;

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.navigate({ to: "/signin" });
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-neutral-900/90 backdrop-blur-md text-neutral-100 px-8 py-4 flex justify-between items-center shadow-lg z-50"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-semibold tracking-wide cursor-pointer select-none"
      >
        <Link to="/">SpendSmart</Link>
      </motion.div>

      {isLoading ? (
        <div className="flex space-x-4">
          <Skeleton className="h-5 w-24 bg-neutral-700" />
          <Skeleton className="h-5 w-24 bg-neutral-700" />
          <Skeleton className="h-5 w-24 bg-neutral-700" />
        </div>
      ) : (
        <ul className="flex space-x-8 text-base font-medium items-center">
          {isLoggedIn ? (
            <>
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Budgets", to: "/budgets" },
                { label: "Transactions", to: "/transactions" },
              ].map((item) => (
                <motion.li
                  key={item.label}
                  whileHover={{ scale: 1.1, color: "#a3a3a3" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="cursor-pointer transition-colors duration-200"
                >
                  <Link to={item.to}>{item.label}</Link>
                </motion.li>
              ))}
              {/* ✅ Logout Button */}
              <Button
                variant="secondary"
                className="ml-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Sign In", to: "/signin" },
                { label: "Sign Up", to: "/signup" },
              ].map((item) => (
                <motion.li
                  key={item.label}
                  whileHover={{ scale: 1.1, color: "#a3a3a3" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="cursor-pointer transition-colors duration-200"
                >
                  <Link to={item.to}>{item.label}</Link>
                </motion.li>
              ))}
            </>
          )}
        </ul>
      )}
    </motion.nav>
  );
}
