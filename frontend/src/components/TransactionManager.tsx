import { useState, useMemo } from "react";
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
import { useGetTransactions } from "@/hooks/transaction/useGetTransactions";
import { useCreateTransaction } from "@/hooks/transaction/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/transaction/useUpdateTransaction";
import { useDeleteTransaction } from "@/hooks/transaction/useDeleteTransaction";
import { useGetCategories } from "@/hooks/category/useGetCategories";

interface TransactionForm {
  amount: number;
  type: "Income" | "Expense";
  categoryId: string | null;
  description: string;
  isRecurring: boolean;
}

export default function TransactionManager() {
  // Filters
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");

  const filters = useMemo(
    () => ({
      type: typeFilter === "all" ? undefined : typeFilter,
      category: categoryFilter === "all" ? undefined : categoryFilter,
      isActive: isActiveFilter === "all" ? undefined : isActiveFilter,
    }),
    [typeFilter, categoryFilter, isActiveFilter]
  );

  const { data: transactions, isLoading } = useGetTransactions(filters);
  const { data: categories } = useGetCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  // Dialog + form
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TransactionForm>({
    amount: 0,
    type: "Expense",
    categoryId: "",
    description: "",
    isRecurring: false,
  });

  const handleSubmit = () => {
    if (!formData.amount || !formData.type) return;

    if (editingId) {
      updateTransaction.mutate({ id: editingId, payload: formData });
    } else {
      createTransaction.mutate(formData);
    }

    setFormData({
      amount: 0,
      type: "Expense",
      categoryId: "",
      description: "",
      isRecurring: false,
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (txn: any) => {
    setFormData({
      amount: txn.amount,
      type: txn.type,
      categoryId: txn.categoryId?._id || txn.categoryId || "",
      description: txn.description,
      isRecurring: txn.isRecurring,
    });
    setEditingId(txn._id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg font-medium">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 my-20 mx-auto w-[92%] md:w-[85%] transition-shadow hover:shadow-xl">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-semibold text-gray-800">Transactions</h2>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] border-gray-300 focus:ring-gray-800">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] border-gray-300 focus:ring-gray-800">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories &&
                categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Active Filter */}
          <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
            <SelectTrigger className="w-[150px] border-gray-300 focus:ring-gray-800">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Transaction */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transition-all">
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </DialogTrigger>

            {/* Transaction Form Dialog */}
            <DialogContent className="bg-white shadow-xl rounded-xl border border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-800">
                  {editingId ? "Edit Transaction" : "Create Transaction"}
                </DialogTitle>
              </DialogHeader>

              <motion.div
                className="space-y-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Type */}
                <div>
                  <Label className="text-gray-700">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        type: value as "Income" | "Expense",
                      })
                    }
                  >
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Expense">Expense</SelectItem>
                      <SelectItem value="Income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <Label className="text-gray-700">Category</Label>
                  <Select
                    value={formData.categoryId || "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoryId: value === "all" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">None</SelectItem>
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
                  <Label className="text-gray-700">Amount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: Number(e.target.value) })
                    }
                    className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="text-gray-700">Description</Label>
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                    placeholder="e.g. Rent, Groceries"
                  />
                </div>

                {/* Recurring */}
                <div className="flex items-center gap-2">
                  <input
                    id="recurring"
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) =>
                      setFormData({ ...formData, isRecurring: e.target.checked })
                    }
                    className="h-4 w-4 text-gray-800 rounded border-gray-300 focus:ring-gray-800"
                  />
                  <Label htmlFor="recurring" className="text-gray-700">
                    Recurring Transaction
                  </Label>
                </div>

                {/* Submit */}
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium shadow-md hover:shadow-lg"
                  onClick={handleSubmit}
                  disabled={
                    createTransaction.isPending || updateTransaction.isPending
                  }
                >
                  {editingId ? "Update Transaction" : "Create Transaction"}
                </Button>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-semibold">Type</TableHead>
              <TableHead className="text-gray-700 font-semibold">Category</TableHead>
              <TableHead className="text-gray-700 font-semibold">Amount</TableHead>
              <TableHead className="text-gray-700 font-semibold">Description</TableHead>
              <TableHead className="text-right text-gray-700 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {transactions && transactions.length > 0 ? (
                transactions.map((txn) => (
                  <motion.tr
                    key={txn._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell
                      className={`font-semibold ${
                        txn.type === "Expense" ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {txn.type}
                    </TableCell>
                    <TableCell className="text-gray-800 font-medium">
                      {txn.categoryId?.name || "—"}
                    </TableCell>
                    <TableCell className="text-gray-700 font-semibold">
                      ₹{txn.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {txn.description || "—"}
                    </TableCell>
                    <TableCell className="text-right flex gap-3 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-gray-100"
                        onClick={() => handleEdit(txn)}
                      >
                        <Pencil className="h-4 w-4 text-gray-700" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-rose-50"
                        onClick={() => handleDelete(txn._id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                    No transactions found
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
