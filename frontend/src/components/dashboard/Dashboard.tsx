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
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
} from "recharts";
import { useGetBudgets } from "@/hooks/budget/useGetBudgets";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#eab308", "#06b6d4"];

export default function Dashboard() {
  const { data: transactions = [] } = useGetTransactions({});
  const { data: budgets = [] } = useGetBudgets();
  const { data: categories = [] } = useGetCategories();

  // Group transactions by date
  const dailyDataMap: Record<
    string,
    { date: string; income: number; expense: number }
  > = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt).toISOString().split("T")[0];
    if (!dailyDataMap[date]) {
      dailyDataMap[date] = { date, income: 0, expense: 0 };
    }
    if (t.type === "Income") dailyDataMap[date].income += t.amount;
    else dailyDataMap[date].expense += t.amount;
  });

  const dailyData = Object.values(dailyDataMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-10 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dashboard Overview
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <SummaryCard title="Total Income" value={totalIncome} color="text-emerald-600" />
        <SummaryCard title="Total Expenses" value={totalExpense} color="text-rose-600" />
        <SummaryCard
          title="Net Balance"
          value={netBalance}
          color={netBalance >= 0 ? "text-indigo-600" : "text-rose-600"}
        />
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

      {/* Income vs Expense Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all mt-10"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Income vs Expense (Day by Day)
        </h3>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                  })
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `₹${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2.5}
                dot={false}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={false}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No transaction data available yet.
          </p>
        )}
      </motion.div>
    </div>
  );
}

// Reusable summary card
function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg border border-gray-100 bg-white hover:shadow-xl transition-all">
        <CardHeader>
          <CardTitle className="text-gray-700">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-semibold ${color}`}>
            ₹{value.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
