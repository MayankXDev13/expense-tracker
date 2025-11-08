import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/transaction";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTransaction: Transaction | null;
  onSave: (transaction: Transaction) => void;
  isSaving?: boolean;
};

export default function TransactionDialog({
  open,
  onOpenChange,
  editingTransaction,
  onSave,
  isSaving = false,
}: Props) {



  
  const [form, setForm] = useState<Partial<Transaction>>({
    amount: 0,
    type: "Expense",
    category: "",
    description: "",
    isRecurring: false,
    isActive: true,
  });

  const [categoryDisplay, setCategoryDisplay] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form state when editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      // Extract category ID and display name
      const categoryId = typeof editingTransaction.category === "string"
        ? editingTransaction.category
        : editingTransaction.category?._id || "";
      
      const categoryName = typeof editingTransaction.category === "object" && editingTransaction.category?.name
        ? editingTransaction.category.name
        : editingTransaction.category?.type || categoryId || "";
      
      setForm({
        ...editingTransaction,
        category: categoryId,
      });
      setCategoryDisplay(categoryName);
    } else {
      setForm({
        amount: 0,
        type: "Expense",
        category: "",
        description: "",
        isRecurring: false,
        isActive: true,
      });
      setCategoryDisplay("");
    }
    setErrors({});
  }, [editingTransaction, open]);

  const handleChange = (
    key: keyof Transaction,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!form.amount || form.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    // Handle category as string or object
    const categoryValue = typeof form.category === "string" 
      ? form.category 
      : form.category?._id || form.category?.name || "";
    
    if (!categoryValue || (typeof categoryValue === "string" && !categoryValue.trim())) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(form as Transaction);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Grocery shopping"
              disabled={isSaving}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={form.amount || ""}
              onChange={(e) =>
                handleChange("amount", parseFloat(e.target.value) || 0)
              }
              placeholder="Enter amount"
              disabled={isSaving}
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="border rounded-md p-2 w-full"
              disabled={isSaving}
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={form.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="e.g. Food, Salary, etc."
              disabled={isSaving}
            />
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={form.isRecurring || false}
              onChange={(e) => handleChange("isRecurring", e.target.checked)}
              disabled={isSaving}
            />
            <Label htmlFor="recurring">Recurring</Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.isActive !== false}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              disabled={isSaving}
            />
            <Label htmlFor="active">Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : editingTransaction
                ? "Update"
                : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}