import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section className="bg-neutral-950 text-neutral-100 h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Take Control of Your Finances with{" "}
          <span className="relative text-neutral-300 before:absolute before:inset-0 before:blur-2xl before:bg-neutral-500/20 before:-z-10">
            SpendSmart
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-neutral-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          Track your expenses, manage budgets, and make smarter financial
          decisions — all in one beautifully simple dashboard.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-5"
        >
          {/* Primary Button */}
          <Button className="relative group bg-neutral-100 text-neutral-900 font-medium text-lg px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:bg-neutral-200 active:scale-95">
            <span className="relative z-10">Get Started</span>
          </Button>

          {/* Secondary Button */}
          <Button
            variant="outline"
            className="relative border border-neutral-700 text-neutral-900 font-medium text-lg px-8 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:border-neutral-500 hover:text-neutral-100 hover:bg-neutral-800/70 active:scale-95"
          >
            <span className="relative z-10">Learn More</span>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
