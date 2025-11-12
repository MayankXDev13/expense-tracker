"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";

import { useGetCategories } from "@/hooks/category/useGetCategories";
import { useGetBudgets } from "@/hooks/budget/useGetBudgets";
import { useCreateBudget } from "@/hooks/budget/useCreateBudget";
import { useUpdateBudget } from "@/hooks/budget/useUpdateBudget";
import { useDeleteBudget } from "@/hooks/budget/useDeleteBudget";
import type { IBudget } from "@/types/budget.types";

interface BudgetForm {
  categoryId: string | null;
  limitAmount: number;
  period: string;
  startDate: string;
  endDate?: string;
  alertThreshold: number;
  isGlobal: boolean;
}

export default function BudgetManager() {
  const { data: budgets, isLoading } = useGetBudgets();
  const { data: categories } = useGetCategories();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();
  console.log(budgets);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BudgetForm>({
    categoryId: "",
    limitAmount: 0,
    period: "monthly",
    startDate: "",
    endDate: "",
    alertThreshold: 80,
    isGlobal: false,
  });

  const handleSubmit = () => {
    if (!formData.limitAmount || !formData.startDate) return;

    if (editingId) updateBudget.mutate({ id: editingId, payload: formData });
    else createBudget.mutate(formData);

    setFormData({
      categoryId: "",
      limitAmount: 0,
      period: "monthly",
      startDate: "",
      endDate: "",
      alertThreshold: 80,
      isGlobal: false,
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (budget: IBudget) => {
    setFormData({
      categoryId: budget.categoryId,
      limitAmount: budget.limitAmount,
      period: budget.period,
      startDate: budget.startDate,
      endDate: budget.endDate,
      alertThreshold: budget.alertThreshold,
      isGlobal: budget.isGlobal,
    });
    setEditingId(budget._id);
    setOpen(true);
  };

  const handleDelete = (id: string) => deleteBudget.mutate(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-neutral-400 text-lg font-medium">
        Loading budgets...
      </div>
    );
  }

  return (
    <section
      className="mx-auto mt-28 mb-24 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[70%] 
                        bg-neutral-900/70 backdrop-blur-md rounded-2xl border border-neutral-800 
                        text-neutral-100 shadow-lg px-5 sm:px-8 py-8 transition-all hover:shadow-2xl"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 text-center sm:text-left">
          Manage Budgets
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base py-2">
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-neutral-900/90 text-neutral-100 backdrop-blur-md border border-neutral-700 rounded-xl shadow-2xl max-w-sm w-[90%] sm:w-[80%]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingId ? "Edit Budget" : "Create Budget"}
              </DialogTitle>
            </DialogHeader>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Select */}
              <div>
                <Label>Category</Label>
                <Select
                  value={
                    formData.isGlobal ? "global" : formData.categoryId || ""
                  }
                  onValueChange={(value) => {
                    if (value === "global") {
                      setFormData({
                        ...formData,
                        isGlobal: true,
                        categoryId: null,
                      });
                    } else {
                      setFormData({
                        ...formData,
                        isGlobal: false,
                        categoryId: value,
                      });
                    }
                  }}
                >
                  <SelectTrigger className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400">
                    <SelectValue placeholder="Select Category or Global" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global Budget</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div>
                <Label>Limit Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.limitAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      limitAmount: Number(e.target.value),
                    })
                  }
                  placeholder="Enter budget limit"
                  className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              {/* Period */}
              <div>
                <Label>Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) =>
                    setFormData({ ...formData, period: value })
                  }
                >
                  <SelectTrigger className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400"
                  />
                </div>
              </div>

              {/* Threshold */}
              <div>
                <Label>Alert Threshold (%)</Label>
                <Input
                  type="number"
                  value={formData.alertThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alertThreshold: Number(e.target.value),
                    })
                  }
                  placeholder="e.g. 80"
                  className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400"
                />
              </div>

              <Button
                className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium"
                onClick={handleSubmit}
                disabled={createBudget.isPending || updateBudget.isPending}
              >
                {editingId ? "Update Budget" : "Create Budget"}
              </Button>
            </motion.div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Budget Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-auto rounded-xl border border-neutral-800"
      >
        <Table className="w-full text-sm sm:text-base">
          <TableHeader>
            <TableRow className="bg-neutral-800/60 border-b border-neutral-700">
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Type
              </TableHead>
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Limit
              </TableHead>
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Spent
              </TableHead>
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Period
              </TableHead>
              <TableHead className="text-right text-neutral-300 font-semibold px-4 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {budgets && budgets.length > 0 ? (
                budgets.map((budget: IBudget) => {
                  const categoryName = budget.isGlobal
                    ? "Global"
                    : categories?.find((cat) => cat._id === budget.categoryId)
                        ?.name || "—";

                  return (
                    <motion.tr
                      key={budget._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-neutral-800/40 transition-colors"
                    >
                      <TableCell className="font-medium text-neutral-100">
                        {categoryName}
                      </TableCell>

                      <TableCell className="text-neutral-200 font-semibold">
                        ₹{budget.limitAmount.toLocaleString()}
                      </TableCell>

                      <TableCell
                        className={`font-semibold ${
                          budget.isExceeded
                            ? "text-rose-400"
                            : "text-neutral-300"
                        }`}
                      >
                        ₹{budget.spentAmount?.toLocaleString() || 0}
                      </TableCell>

                      <TableCell className="text-neutral-400 capitalize">
                        {budget.period}
                      </TableCell>

                      <TableCell className="text-right flex gap-3 justify-end">
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-neutral-700 bg-transparent hover:bg-neutral-800/50 transition"
                          onClick={() => handleEdit(budget)}
                        >
                          <Pencil className="h-4 w-4 text-neutral-300" />
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          className="border-neutral-700 bg-transparent hover:bg-rose-900/30 transition"
                          onClick={() => handleDelete(budget._id)}
                        >
                          <Trash2 className="h-4 w-4 text-rose-400" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-neutral-400 py-6"
                  >
                    No budgets found
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </section>
  );
}
