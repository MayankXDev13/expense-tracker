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
  const [formData, setFormData] = useState<{ name: string; type: "Expense" | "Income" }>({
    name: "",
    type: "Expense",
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

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
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg font-medium">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 my-20 mx-auto w-[92%] md:w-[70%] transition-shadow hover:shadow-xl">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-semibold text-gray-800">Manage Categories</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gray-800 hover:bg-gray-700 text-white shadow-md hover:shadow-lg transition-all">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white shadow-xl rounded-xl border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                {editingId ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <Label htmlFor="name" className="text-gray-700">
                  Category Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Food, Travel"
                  className="mt-1 border-gray-300 focus:border-gray-800 focus:ring-gray-800"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label className="text-gray-700">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as "Expense" | "Income" })
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

              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium shadow-md hover:shadow-lg"
                onClick={handleSubmit}
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {editingId ? "Update Category" : "Create Category"}
              </Button>
            </motion.div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Category Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-700 font-semibold">Name</TableHead>
              <TableHead className="text-gray-700 font-semibold">Type</TableHead>
              <TableHead className="text-right text-gray-700 font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <motion.tr
                    key={category._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-800">
                      {category.name}
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        category.type === "Expense"
                          ? "text-rose-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {category.type}
                    </TableCell>
                    <TableCell className="text-right flex gap-3 justify-end">
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-gray-100"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4 text-gray-700" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-rose-50"
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-600" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                    No categories found
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
