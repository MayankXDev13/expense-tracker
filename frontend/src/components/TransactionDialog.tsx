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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTransaction) {
      const categoryId =
        typeof editingTransaction.category === "string"
          ? editingTransaction.category
          : editingTransaction.category?._id || "";

      setForm({
        ...editingTransaction,
        category: categoryId,
      });
    } else {
      setForm({
        amount: 0,
        type: "Expense",
        category: "",
        description: "",
        isRecurring: false,
        isActive: true,
      });
    }
    setErrors({});
  }, [editingTransaction, open]);

  const handleChange = (
    key: keyof Transaction,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.description?.trim()) newErrors.description = "Description is required";
    if (!form.amount || form.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!form.category?.toString().trim()) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(form as Transaction);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingTransaction ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Grocery shopping"
              disabled={isSaving}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
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
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select
              value={form.type || "Expense"}
              onValueChange={(val) => handleChange("type", val)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={form.category || ""}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="e.g. Food, Salary, etc."
              disabled={isSaving}
            />
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center justify-between w-full">
              <Label htmlFor="recurring" className="text-sm">
                Recurring
              </Label>
              <Switch
                id="recurring"
                checked={form.isRecurring || false}
                onCheckedChange={(val) => handleChange("isRecurring", val)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between w-full">
              <Label htmlFor="active" className="text-sm cursor-pointer">
                Active
              </Label>
              <Switch
                id="active"
                checked={form.isActive ?? true}
                onCheckedChange={(val) => handleChange("isActive", val)}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : editingTransaction ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
