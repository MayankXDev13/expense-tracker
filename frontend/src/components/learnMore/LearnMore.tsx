import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export default function LearnMore() {
  const features = [
    {
      title: "Track Every Expense",
      description:
        "Log and visualize your spending habits across multiple categories with intuitive charts and filters.",
    },
    {
      title: "Create Smart Budgets",
      description:
        "Set monthly or custom budgets and monitor progress in real time to stay on top of your goals.",
    },
    {
      title: "Insightful Dashboard",
      description:
        "Get a complete overview of your income, expenses, and savings — all beautifully visualized.",
    },
    {
      title: "Safe & Secure",
      description:
        "Your data is encrypted and protected, ensuring privacy while managing your finances.",
    },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100 px-6 py-20 flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neutral-400/10 blur-3xl rounded-full" />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl text-center mb-16"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">
          Learn More About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-gray-300 to-gray-400">
            SpendSmart
          </span>
        </h1>
        <p className="text-neutral-400 text-lg sm:text-xl">
          Discover how SpendSmart helps you manage your money smarter — built to
          empower you to take control of your financial journey.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group bg-neutral-900/50 border border-neutral-800/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 hover:bg-neutral-900/70 hover:border-neutral-700 transition-all duration-300 shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-3 text-neutral-100 group-hover:text-gray-300">
              {feature.title}
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative z-10 mt-20 text-center"
      >
        <h3 className="text-3xl font-bold mb-4 text-neutral-100">
          Ready to start your smart finance journey?
        </h3>
        <p className="text-neutral-400 mb-8 text-lg">
          Join thousands of users managing their expenses the smart way.
        </p>
        <Link to="/signup">
          <Button className="bg-neutral-100 text-neutral-900 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-neutral-200 active:scale-95 transition-all duration-300">
            Get Started with SpendSmart
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
