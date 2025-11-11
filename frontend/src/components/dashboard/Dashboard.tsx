"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useGetTransactions } from "@/hooks/transaction/useGetTransactions";
import { useGetBudgets } from "@/hooks/budget/useGetBudgets";
import { useGetCategories } from "@/hooks/category/useGetCategories";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export default function Dashboard() {
  const { data: transactions = [] } = useGetTransactions({});
  const { data: budgets = [] } = useGetBudgets();
  const { data: categories = [] } = useGetCategories();

  // --- Data Prep ---
  const dailyDataMap: Record<
    string,
    { date: string; income: number; expense: number }
  > = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt).toISOString().split("T")[0];
    if (!dailyDataMap[date])
      dailyDataMap[date] = { date, income: 0, expense: 0 };
    if (t.type === "Income") dailyDataMap[date].income += t.amount;
    else dailyDataMap[date].expense += t.amount;
  });

  const dailyData = Object.values(dailyDataMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const expenseByCategory = categories.map((cat) => {
    const total = transactions
      .filter((t) => t.type === "Expense" && t.categoryId?._id === cat._id)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat.name, value: total };
  });

  const avgBudgetUsage =
    budgets.length > 0
      ? budgets.reduce(
          (sum, b) => sum + (b.spentAmount / b.limitAmount) * 100,
          0
        ) / budgets.length
      : 0;

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-100 px-5 sm:px-8 py-10 my-10 ">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-12 text-center text-neutral-100"
      >
        Dashboard Overview
      </motion.h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <SummaryCard
          title="Total Income"
          value={totalIncome}
          color="text-emerald-400"
        />
        <SummaryCard
          title="Total Expenses"
          value={totalExpense}
          color="text-rose-400"
        />
        <SummaryCard
          title="Net Balance"
          value={netBalance}
          color={netBalance >= 0 ? "text-indigo-400" : "text-rose-400"}
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Breakdown */}
        <Card className="bg-neutral-900/70 border border-neutral-800 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-neutral-100 text-lg font-semibold">
              Expense Breakdown by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {expenseByCategory.some((e) => e.value > 0) ? (
              <ChartContainer
                className="h-[280px]"
                config={{
                  value: { label: "Expenses", color: "var(--chart-1)" },
                }}
              >
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {expenseByCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-neutral-500 text-center pt-12">
                No expense data available yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card className="bg-neutral-900/70 border border-neutral-800 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-neutral-100 text-lg font-semibold">
              Budget Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            {budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.map((b) => {
                  const percent = Math.min(
                    (b.spentAmount / b.limitAmount) * 100,
                    100
                  );
                  return (
                    <div key={b._id}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="text-neutral-300">
                          {b.isGlobal
                            ? "🌐 Global"
                            : b.categoryId?.name || "Unknown"}
                        </span>
                        <span
                          className={`font-medium ${
                            percent >= 90
                              ? "text-rose-400"
                              : percent >= 70
                                ? "text-amber-400"
                                : "text-emerald-400"
                          }`}
                        >
                          {percent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full rounded-full ${
                            percent >= 90
                              ? "bg-rose-500"
                              : percent >= 70
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
                <p className="pt-4 text-center text-sm text-neutral-400">
                  Avg Usage:{" "}
                  <span className="text-neutral-100 font-semibold">
                    {avgBudgetUsage.toFixed(1)}%
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-neutral-500 text-center pt-10">
                No budgets created yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card className="mt-10 bg-neutral-900/70 border border-neutral-800 shadow-xl backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-neutral-100 text-lg font-semibold">
            Income vs Expense (Day by Day)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.length > 0 ? (
            <ChartContainer
              className="min-h-[350px] w-full"
              config={{
                income: { label: "Income", color: "var(--chart-1)" },
                expense: { label: "Expense", color: "var(--chart-2)" },
              }}
            >
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) =>
                    new Date(d).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="text-neutral-500 text-center py-10">
              No transaction data available yet.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

// Reusable Summary Card
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
      <Card className="bg-neutral-900/70 border border-neutral-800 shadow-md backdrop-blur-md hover:shadow-xl transition-all">
        <CardHeader>
          <CardTitle className="text-neutral-400 text-sm font-medium">
            {title}
          </CardTitle>
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
