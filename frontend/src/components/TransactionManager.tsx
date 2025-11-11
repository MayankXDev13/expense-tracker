import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import TransactionFilter from "./TransactionFilter";
import TransactionTable from "./TransactionTable";
import TransactionSummary from "./TransactionSummary";
import TransactionDialog from "./TransactionDialog";
import type { Transaction } from "@/types/transaction";
import { useGetTransactions } from "@/hooks/transaction/useGetTransactions";
import { useCreateTransaction } from "@/hooks/transaction/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/transaction/useUpdateTransaction";
import { useDeleteTransaction } from "@/hooks/transaction/useDeleteTransaction";
import { Loader2 } from "lucide-react";

export default function TransactionManager() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    active: "",
  });

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useGetTransactions(filters);
  const { mutate: createTransaction, isPending: isCreating } =
    useCreateTransaction();
  const { mutate: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const isSaving = isCreating || isUpdating;

  // Calculate totals using useMemo
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);

  const handleSave = useCallback(
    (tx: Transaction) => {
      if (editingId) updateTransaction(tx);
      else createTransaction(tx);
      handleDialogClose();
    },
    [editingId, updateTransaction, createTransaction]
  );

  const handleDelete = useCallback(
    (id: string) => deleteTransaction(id),
    [deleteTransaction]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingId(null);
  }, []);

  const handleEdit = useCallback((tx: Transaction) => {
    setEditingId(tx._id!);
    setDialogOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingId(null);
    setDialogOpen(true);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ type: "", category: "", active: "" });
    toast.success("Filters Cleared", {
      description: "All filters have been reset.",
    });
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching transactions", {
        description: "Unable to load transactions. Please try again later.",
      });
    }
  }, [isError]);

  const editingTransaction = useMemo(
    () => transactions.find((t) => t._id === editingId) || null,
    [transactions, editingId]
  );

  return (
<div className="space-y-6 pt-24 pb-16 px-4 md:px-8">
      <TransactionFilter
        filters={filters}
        setFilters={setFilters}
        onAddClick={handleAdd}
        onClearFilters={clearFilters}
      />

      <TransactionSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
        error={isError ? "Failed to fetch transactions" : null}
      />

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingTransaction={editingTransaction}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {!isLoading && !isError && transactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <p className="text-lg font-medium mb-2">No transactions found</p>
          <p className="text-sm">Add your first transaction to get started!</p>
        </motion.div>
      )}

      {/* Saving Indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Loader2 size={18} className="animate-spin" />
            <span>Saving changes...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
