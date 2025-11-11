import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";
import { useLogout } from "@/hooks/user/useLogout";

export default function Navbar() {
  const { data: user, isLoading } = useCurrentUser();
  const { logout, isLoggingOut } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!user;

  const navItems = isLoggedIn
    ? [
        { label: "Dashboard", to: "/dashboards" },
        { label: "Budgets", to: "/budgets" },
        { label: "Transactions", to: "/transactions" },
        { label: "Categories", to: "/categories" },
      ]
    : [
        { label: "Dashboard", to: "/dashboards" },
        { label: "Sign Up", to: "/signup" },
        { label: "Sign In", to: "/signin" },
      ];

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] 
        bg-neutral-900/50 backdrop-blur-md border border-neutral-800/40 
        text-neutral-100 rounded-4xl px-5 py-3 sm:px-8 sm:py-4 
        flex justify-between items-center shadow-lg z-50"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-xl sm:text-2xl font-semibold tracking-wide cursor-pointer select-none"
      >
        <Link to="/" className="text-gray-100 hover:text-gray-300">
          SpendSmart
        </Link>
      </motion.div>

      {/* Desktop Navigation */}
      {isLoading ? (
        <div className="hidden sm:flex space-x-4">
          <Skeleton className="h-5 w-20 bg-neutral-700" />
          <Skeleton className="h-5 w-20 bg-neutral-700" />
          <Skeleton className="h-5 w-20 bg-neutral-700" />
        </div>
      ) : (
        <>
          {/* Desktop Menu */}
          <ul className="hidden sm:flex space-x-8 text-base font-medium items-center">
            {navItems.map((item) => (
              <motion.li
                key={item.label}
                whileHover={{ scale: 1.05, color: "#a3a3a3" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer transition-colors duration-200"
              >
                <Link to={item.to} className="hover:text-gray-300">
                  {item.label}
                </Link>
              </motion.li>
            ))}

            {isLoggedIn && (
              <Button
                variant="secondary"
                className="ml-4 rounded-xl"
                onClick={() => logout()}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-gray-300 hover:text-white transition"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-3 w-full rounded-2xl 
                  bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/50
                  shadow-lg p-5 flex flex-col space-y-4 sm:hidden"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-200 hover:text-gray-400 text-lg"
                  >
                    {item.label}
                  </Link>
                ))}

                {isLoggedIn && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="rounded-xl"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.nav>
  );
}
