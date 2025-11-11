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

    if (editingId) {
      updateBudget.mutate({ id: editingId, payload: formData });
    } else {
      createBudget.mutate(formData);
    }

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

  const handleDelete = (id: string) => {
    deleteBudget.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg font-medium">
        Loading budgets...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 my-20 mx-auto w-[92%] md:w-[80%] transition-shadow hover:shadow-xl">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-semibold text-gray-800">Manage Budgets</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white shadow-xl rounded-xl border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
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
                <Label className="text-gray-700">Category</Label>
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
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800">
                    <SelectValue placeholder="Select Category or Global" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global Budget</SelectItem>
                    {categories &&
                      categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div>
                <Label className="text-gray-700">Limit Amount (₹)</Label>
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
                  className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>

              {/* Period */}
              <div>
                <Label className="text-gray-700">Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) =>
                    setFormData({ ...formData, period: value })
                  }
                >
                  <SelectTrigger className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800">
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
                  <Label className="text-gray-700">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
              </div>

              {/* Threshold */}
              <div>
                <Label className="text-gray-700">Alert Threshold (%)</Label>
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
                  className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>

              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium shadow-md hover:shadow-lg"
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
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-semibold">
                Type
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Limit
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Spent
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Period
              </TableHead>
              <TableHead className="text-right text-gray-700 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {Array.isArray(budgets) && budgets.length > 0 ? (
                budgets.map((budget: IBudget) => (
                  <motion.tr
                    key={budget._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-800">
                      {budget.isGlobal
                        ? "🌐 Global"
                        : (typeof budget.categoryId === "object" &&
                          budget.categoryId !== null
                          ? (budget.categoryId as { name?: string }).name || "—"
                          : "—")}
                    </TableCell>
                    <TableCell className="text-gray-700 font-semibold">
                      ₹{budget.limitAmount.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        budget.isExceeded ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      ₹{budget.spentAmount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-gray-600 capitalize">
                      {budget.period}
                    </TableCell>
                    <TableCell className="text-right flex gap-3 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-gray-100"
                        onClick={() => handleEdit(budget)}
                      >
                        <Pencil className="h-4 w-4 text-gray-700" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-rose-50"
                        onClick={() => handleDelete(budget._id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-4"
                  >
                    No budgets found
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
