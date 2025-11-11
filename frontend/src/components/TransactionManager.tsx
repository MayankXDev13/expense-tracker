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

    if (editingId) updateTransaction.mutate({ id: editingId, payload: formData });
    else createTransaction.mutate(formData);

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

  const handleDelete = (id: string) => deleteTransaction.mutate(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-neutral-400 text-lg font-medium">
        Loading transactions...
      </div>
    );
  }

  return (
    <section className="mx-auto mt-28 mb-24 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[70%] 
                        bg-neutral-900/70 backdrop-blur-md rounded-2xl border border-neutral-800 
                        text-neutral-100 shadow-lg px-5 sm:px-8 py-8 transition-all hover:shadow-2xl">
      {/* Header + Filters */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 text-center sm:text-left">
          Transactions
        </h2>

        {/* Filters + Add Button */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400">
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
            <SelectTrigger className="w-[150px] bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Active Filter */}
          <Select value={isActiveFilter} onValueChange={setIsActiveFilter}>
            <SelectTrigger className="w-[150px] bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400">
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
              <Button className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </DialogTrigger>

            {/* Transaction Form Dialog */}
            <DialogContent className="bg-neutral-900/90 text-neutral-100 backdrop-blur-md border border-neutral-700 rounded-xl shadow-2xl max-w-sm w-[90%] sm:w-[80%]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
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
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as "Income" | "Expense" })
                    }
                  >
                    <SelectTrigger className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400">
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
                  <Label>Category</Label>
                  <Select
                    value={formData.categoryId || "all"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoryId: value === "all" ? null : value,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">None</SelectItem>
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
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: Number(e.target.value) })
                    }
                    className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400"
                    placeholder="Enter amount"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <Input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400"
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
                    className="h-4 w-4 accent-neutral-400 rounded border-neutral-600 bg-neutral-800"
                  />
                  <Label htmlFor="recurring">Recurring Transaction</Label>
                </div>

                {/* Submit */}
                <Button
                  className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium"
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
        className="overflow-x-auto rounded-xl border border-neutral-800"
      >
        <Table className="w-full text-sm sm:text-base">
          <TableHeader>
            <TableRow className="bg-neutral-800/60 border-b border-neutral-700">
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Type
              </TableHead>
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Category
              </TableHead>
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Amount
              </TableHead>
              <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                Description
              </TableHead>
              <TableHead className="text-right text-neutral-300 font-semibold px-4 py-3">
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
                    className="hover:bg-neutral-800/40 transition-colors"
                  >
                    <TableCell
                      className={`font-semibold ${
                        txn.type === "Expense" ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {txn.type}
                    </TableCell>
                    <TableCell className="text-neutral-200 font-medium">
                      {txn.categoryId?.name || "—"}
                    </TableCell>
                    <TableCell className="text-neutral-200 font-semibold">
                      ₹{txn.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-neutral-400">
                      {txn.description || "—"}
                    </TableCell>
                    <TableCell className="text-right flex gap-3 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-neutral-700 bg-transparent hover:bg-neutral-800/50 transition"
                        onClick={() => handleEdit(txn)}
                      >
                        <Pencil className="h-4 w-4 text-neutral-300" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="border-neutral-700 bg-transparent hover:bg-rose-900/30 transition"
                        onClick={() => handleDelete(txn._id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-400" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-neutral-400 py-6"
                  >
                    No transactions found
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
