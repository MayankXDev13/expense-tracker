import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
    // Map the "all" sentinel back to empty string for your filter state
    const normalized = value === "all" ? "" : value;
    setFilters({ ...filters, [key]: normalized });
  };

  const hasActiveFilters = !!(
    filters.type ||
    filters.category ||
    filters.active
  );

  return (
    <div className="px-4 md:px-8 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        {/* <Button onClick={onAddClick} className="gap-2">
          <Plus size={18} />
          New Transaction
        </Button> */}
      </div>

      <Card className="border border-border/50 shadow-sm bg-muted/30 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Filters</h2>
          
          <Button onClick={onAddClick} className="gap-2">
            <Plus size={18} />
            New Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={filters.type || "all"}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                placeholder="Search by category"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="bg-background"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={filters.active || "all"}
                onValueChange={(value) => handleFilterChange("active", value)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Button */}
          {hasActiveFilters && (
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="gap-2"
              >
                <RotateCcw size={16} />
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
