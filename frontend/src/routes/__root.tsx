
import { createRootRoute, Outlet } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-screen text-center text-neutral-400"
    >
      <h1 className="text-4xl font-bold text-neutral-100 mb-2">404</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
    </motion.div>
  );
}

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
    </>
  ),
  notFoundComponent: NotFoundPage, 
});
