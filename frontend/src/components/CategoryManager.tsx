"use client";

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
  const [formData, setFormData] = useState<{
    name: string;
    type: "Expense" | "Income";
  }>({
    name: "",
    type: "Expense",
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    if (editingId) updateCategory.mutate({ id: editingId, payload: formData });
    else createCategory.mutate(formData);
    setFormData({ name: "", type: "Expense" });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (category: ICategory) => {
    setFormData({ name: category.name, type: category.type });
    setEditingId(category._id);
    setOpen(true);
  };

  const handleDelete = (id: string) => deleteCategory.mutate(id);

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 w-[90%] sm:w-[70%] mx-auto mt-28">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-14 rounded-lg bg-neutral-800/50 animate-pulse border border-neutral-700"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto mt-28 mb-24 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[70%]
                        bg-neutral-900/70 backdrop-blur-md rounded-2xl border border-neutral-800
                        text-neutral-100 shadow-lg px-5 sm:px-8 py-8 transition-all hover:shadow-2xl">

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-100 text-center sm:text-left">
          Manage Categories
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium shadow-md hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base py-2">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>

          {/* Dialog Form */}
          <DialogContent className="bg-neutral-900/90 text-neutral-100 backdrop-blur-md border border-neutral-700 rounded-xl shadow-2xl max-w-sm w-[90%] sm:w-[80%]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
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
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Food, Travel"
                  className="mt-1 bg-neutral-800 border-neutral-700 focus:ring-2 focus:ring-neutral-400 text-neutral-100"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as "Expense" | "Income",
                    })
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

              <Button
                className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 font-medium"
                onClick={handleSubmit}
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {editingId ? "Update Category" : "Create Category"}
              </Button>
            </motion.div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Categories Table (Desktop) */}
      <AnimatePresence>
        {categories && categories.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden sm:block overflow-x-auto rounded-xl border border-neutral-800"
            >
              <Table className="w-full text-sm sm:text-base">
                <TableHeader>
                  <TableRow className="bg-neutral-800/60 border-b border-neutral-700">
                    <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                      Name
                    </TableHead>
                    <TableHead className="text-neutral-300 font-semibold px-4 py-3">
                      Type
                    </TableHead>
                    <TableHead className="text-right text-neutral-300 font-semibold px-4 py-3">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {categories.map((category) => (
                    <motion.tr
                      key={category._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-neutral-800/40 transition-colors"
                    >
                      <TableCell className="font-medium text-neutral-100 px-4 py-3 whitespace-nowrap">
                        {category.name}
                      </TableCell>
                      <TableCell className="font-semibold text-neutral-400 px-4 py-3 capitalize">
                        {category.type}
                      </TableCell>
                      <TableCell className="text-right px-4 py-3 flex gap-3 justify-end">
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-neutral-700 bg-transparent hover:bg-neutral-800/50 transition"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4 text-neutral-300" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="border-neutral-700 bg-transparent hover:bg-rose-900/30 transition"
                          onClick={() => handleDelete(category._id)}
                        >
                          <Trash2 className="h-4 w-4 text-rose-400" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>

            {/* Mobile Card View */}
            <div className="flex flex-col sm:hidden gap-4 mt-4">
              {categories.map((category) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-neutral-800/60 rounded-xl border border-neutral-700 flex flex-col gap-3 shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-neutral-100">
                      {category.name}
                    </p>
                    <span className="text-sm font-semibold text-neutral-400 capitalize">
                      {category.type}
                    </span>
                  </div>

                  <div className="h-0.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-neutral-600/40"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-neutral-700 bg-transparent hover:bg-neutral-700/50 transition"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-4 w-4 text-neutral-300" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-neutral-700 bg-transparent hover:bg-rose-900/40 transition"
                      onClick={() => handleDelete(category._id)}
                    >
                      <Trash2 className="h-4 w-4 text-rose-400" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-neutral-400 py-10"
          >
            No categories found
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
