import { useState } from "react";


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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { ICategory } from "@/types/category.types";
import { useGetCategories } from "@/hooks/category/useGetCategories";
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
import { useUpdateCategory } from "@/hooks/category/useUpdateCategory";
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory";

export default function CategoryManager() {
  const { data: categories, isLoading } = useGetCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; type: "Expense" | "Income" }>({ name: "", type: "Expense" });

  const handleSubmit = () => {
    if (!formData.name) return;

    if (editingId) {
      updateCategory.mutate({ id: editingId, payload: formData });
    } else {
      createCategory.mutate(formData);
    }

    setFormData({ name: "", type: "Expense" });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (category: ICategory) => {
    setFormData({ name: category.name, type: category.type });
    setEditingId(category._id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 my-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Category" : "Create Category"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Food, Travel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "Expense" | "Income" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleSubmit}
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {editingId ? "Update Category" : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories && categories.length > 0 ? (
            categories.map((category: ICategory) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.type}</TableCell>
                <TableCell className="text-right flex gap-3 justify-end">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(category)}>
                    <Pencil className="h-4 w-4 text-indigo-600" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleDelete(category._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No categories found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
