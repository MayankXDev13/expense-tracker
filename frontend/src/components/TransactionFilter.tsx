import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";

type Filters = {
  type: string;
  category: string;
  active: string;
};

type Props = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onAddClick: () => void;
  onClearFilters: () => void;
};

export default function TransactionFilter({
  filters,
  setFilters,
  onAddClick,
  onClearFilters,
}: Props) {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.type || filters.category || filters.active;

  return (
    <div className="space-y-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={onAddClick} className="gap-2">
          <Plus size={18} />
          New Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            placeholder="Filter by category"
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.active}
            onChange={(e) => handleFilterChange("active", e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-end">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="w-full gap-2"
            >
              <RotateCcw size={16} />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}