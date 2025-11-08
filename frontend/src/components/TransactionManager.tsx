import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import TransactionFilter from "./TransactionFilter";
import TransactionTable from "./TransactionTable";
import TransactionSummary from "./TransactionSummary";
import TransactionDialog from "./TransactionDialog";
import type { Transaction } from "@/types/transaction";
import { useGetTransactions } from "@/hooks/useGetTransactions";
import { useCreateTransaction } from "@/hooks/useCreateTransaction";
import { useUpdateTransaction } from "@/hooks/useUpdateTransaction";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";

export default function TransactionManager() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    active: "",
  });

  const { data: transactions = [], isLoading, isError } = useGetTransactions(filters);
  const { mutate: createTransaction, isPending: isCreating } = useCreateTransaction();
  const { mutate: updateTransaction, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: deleteTransaction } = useDeleteTransaction();

  const isSaving = isCreating || isUpdating;

 
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

 
  const handleSave = useCallback((tx: Transaction) => {
    if (editingId) {
      console.log(tx);
      
      updateTransaction(tx);
    } else {
      createTransaction(tx);
    }
    handleDialogClose();
  }, [editingId, updateTransaction, createTransaction]);

  const handleDelete = useCallback((id: string) => {
    deleteTransaction(id);
  }, [deleteTransaction]);

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
    toast("Filters Cleared", {
      description: "All filters have been reset.",
    });
  }, []);


  useEffect(() => {
    if (isError) {
      toast("Error fetching transactions", {
        description: "Unable to load transactions. Please try again later.",
      });
    }
  }, [isError]);

  const editingTransaction = useMemo(
    () => transactions.find((t) => t._id === editingId) || null,
    [transactions, editingId]
  );

  return (
    <div className="space-y-6 py-20">
     
      <TransactionFilter
        filters={filters}
        setFilters={setFilters}
        onAddClick={handleAdd}
        onClearFilters={clearFilters}
      />

      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
        error={isError ? "Failed to fetch transactions" : null}
      />

 
      <TransactionSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

 
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        editingTransaction={editingTransaction}
        onSave={handleSave}
        isSaving={isSaving}
      />


      {!isLoading && !isError && transactions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No transactions found. Add your first one!</p>
        </div>
      )}


      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving changes...
        </div>
      )}
    </div>
  );
}