"use client";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import { useGetTransactions } from "@/hooks/transaction/useGetTransactions";
import { useGetBudgets } from "@/hooks/budget/useGetBudgets";
import { useGetCategories } from "@/hooks/category/useGetCategories";
import type { ITransaction } from "@/types/transaction.types";
import type { IBudget } from "@/types/budget.types";

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

  // ----- Daily Income & Expense Aggregation -----
  const dailyDataMap: Record<
    string,
    { date: string; income: number; expense: number }
  > = {};

  transactions.forEach((t: ITransaction) => {
    const date = new Date(t.createdAt!).toISOString().split("T")[0];
    if (!dailyDataMap[date])
      dailyDataMap[date] = { date, income: 0, expense: 0 };
    if (t.type === "Income") dailyDataMap[date].income += t.amount;
    else dailyDataMap[date].expense += t.amount;
  });

  const dailyData = Object.values(dailyDataMap).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // ----- Totals -----
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // ----- Expenses by Category -----
  const expenseByCategory = categories.map((cat) => {
    const total = transactions
      .filter(
        (t: ITransaction) =>
          t.type === "Expense" &&
          t.categoryId &&
          (typeof t.categoryId === "string"
            ? t.categoryId === cat._id
            : t.categoryId._id === cat._id)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return { name: cat.name, value: total };
  });

  // ----- Average Budget Usage -----
  const avgBudgetUsage =
    budgets.length > 0
      ? budgets.reduce(
          (sum, b) => sum + (b.spentAmount / b.limitAmount) * 100,
          0
        ) / budgets.length
      : 0;

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-100 px-5 sm:px-8 py-10 my-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-12 text-center text-neutral-100"
      >
        Dashboard Overview
      </motion.h1>

      {/* ---- Summary Section ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <SummaryCard
          title="Total Income"
          value={totalIncome}
          color="text-neutral-200"
        />
        <SummaryCard
          title="Total Expenses"
          value={totalExpense}
          color="text-neutral-300"
        />
        <SummaryCard
          title="Net Balance"
          value={netBalance}
          color={netBalance >= 0 ? "text-neutral-100" : "text-neutral-400"}
        />
      </div>

      {/* ---- Chart Section ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---- Expense Breakdown ---- */}
        <Card className="bg-neutral-900/70 border border-neutral-800 shadow-xl backdrop-blur-md flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-neutral-100 text-lg font-semibold">
              Expense Breakdown by Category
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Overview of spending by category
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 pb-0">
            {expenseByCategory.some((e) => e.value > 0) ? (
              <ChartContainer
                config={{
                  ...Object.fromEntries(
                    categories.map((cat, i) => [
                      cat.name,
                      { label: cat.name, color: COLORS[i % COLORS.length] },
                    ])
                  ),
                }}
                className="mx-auto w-full h-[300px] sm:h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent nameKey="value" hideLabel />
                      }
                    />
                    <Pie
                      data={expenseByCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      outerRadius="90%"
                      stroke="none"
                    >
                      {expenseByCategory.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                      <LabelList
                        dataKey="name"
                        className="fill-neutral-100"
                        stroke="none"
                        fontSize={12}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-neutral-500 text-center pt-10">
                No expense data available yet.
              </p>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="text-neutral-500 leading-none">
              Showing total expenses by category
            </div>
          </CardFooter>
        </Card>

        {/* ---- Budget Utilization ---- */}
        <Card className="bg-neutral-900 border border-neutral-800 shadow-xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-neutral-100 text-lg font-semibold">
              Budget Utilization
            </CardTitle>
          </CardHeader>

          <CardContent>
            {budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.map((b: IBudget) => {
                  const percent = Math.min(
                    (b.spentAmount / b.limitAmount) * 100,
                    100
                  );

                  const categoryName = b.isGlobal
                    ? "Global"
                    : categories.find((cat) => cat._id === b.categoryId)
                        ?.name || "Unknown";

                  return (
                    <div key={b._id}>
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="text-neutral-400">{categoryName}</span>
                        <span className="font-medium text-neutral-300">
                          {percent.toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full rounded-full bg-neutral-500`}
                        />
                      </div>
                    </div>
                  );
                })}

                <p className="pt-4 text-center text-sm text-neutral-400">
                  Avg Usage:{" "}
                  <span className="text-neutral-200 font-semibold">
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

      {/* ---- Area Chart ---- */}
      <Card className="mt-10 bg-neutral-900 border border-neutral-800 shadow-xl backdrop-blur-md flex flex-col">
        <CardHeader>
          <CardTitle className="text-neutral-100 text-lg font-semibold">
            Income vs Expense (Day by Day)
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Overview of daily transactions
          </CardDescription>
        </CardHeader>

        <CardContent>
          {dailyData.length > 0 ? (
            <ChartContainer
              className="w-full h-[350px]"
              config={{
                income: { label: "Income", color: "var(--chart-1)" },
                expense: { label: "Expense", color: "var(--chart-2)" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dailyData}
                  margin={{ left: 12, right: 12, top: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="oklch(0.35 0.01 270 / 0.3)"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                    className="text-neutral-500"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    type="natural"
                    dataKey="expense"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.35}
                    stackId="a"
                  />
                  <Area
                    type="natural"
                    dataKey="income"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.4}
                    stackId="a"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <p className="text-neutral-500 text-center py-10">
              No transaction data available yet.
            </p>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex flex-col w-full items-center text-sm text-neutral-400">
            <div className="text-neutral-500 leading-none mt-1">
              Based on your recent transaction history
            </div>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}

// ----- Reusable Summary Card -----
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
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="bg-neutral-900 border border-neutral-800/80 rounded-2xl shadow-md backdrop-blur-sm hover:shadow-lg hover:border-neutral-700/80 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-neutral-400 text-sm font-medium tracking-wide">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p
            className={`text-3xl font-semibold tracking-tight ${color} text-neutral-100`}
          >
            ₹{value.toLocaleString("en-IN")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
