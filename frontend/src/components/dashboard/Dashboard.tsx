"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTransactions } from "@/hooks/transaction/useGetTransactions";

import { useGetCategories } from "@/hooks/category/useGetCategories";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useGetBudgets } from "@/hooks/budget/useGetBudgets";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#eab308", "#06b6d4"];

export default function Dashboard() {
  const { data: transactions = [] } = useGetTransactions({});
  const { data: budgets = [] } = useGetBudgets();
  const { data: categories = [] } = useGetCategories();

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Expense breakdown by category
  const expenseByCategory = categories.map((cat) => {
    const total = transactions
      .filter((t) => t.type === "Expense" && t.categoryId?._id === cat._id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat.name, value: total };
  });

  // Budget utilization (average %)
  const avgBudgetUsage =
    budgets.length > 0
      ? budgets.reduce((sum, b) => sum + (b.spentAmount / b.limitAmount) * 100, 0) /
        budgets.length
      : 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen mt-15">
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-10 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dashboard Overview
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Income */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-gray-700">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-emerald-600">
                ₹{totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-gray-700">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-rose-600">
                ₹{totalExpense.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Balance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-gray-700">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-semibold ${
                  netBalance >= 0 ? "text-indigo-600" : "text-rose-600"
                }`}
              >
                ₹{netBalance.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Expense Breakdown by Category
          </h3>
          {expenseByCategory.some((e) => e.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {expenseByCategory.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No expense data available yet.
            </p>
          )}
        </motion.div>

        {/* Budget Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Budget Utilization
          </h3>
          {budgets && budgets.length > 0 ? (
            <div className="space-y-4">
              {budgets.map((b) => {
                const percent = Math.min(
                  (b.spentAmount / b.limitAmount) * 100,
                  100
                );
                return (
                  <div key={b._id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700 text-sm">
                        {b.isGlobal
                          ? "🌐 Global Budget"
                          : b.categoryId?.name || "Unknown"}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          percent >= 90
                            ? "text-rose-600"
                            : percent >= 70
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6 }}
                        className={`h-full rounded-full ${
                          percent >= 90
                            ? "bg-rose-600"
                            : percent >= 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      ></motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No budgets created yet.
            </p>
          )}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Avg Usage:{" "}
            <span className="font-semibold text-gray-800">
              {avgBudgetUsage.toFixed(1)}%
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
