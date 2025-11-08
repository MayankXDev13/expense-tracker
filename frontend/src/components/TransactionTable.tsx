import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transaction } from "@/types/transaction";

type Props = {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  error: string | null;
};

const rowVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  loading,
  error,
}: Props) {
  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <span className="text-sm text-muted-foreground animate-pulse">
          Loading transactions...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-8 text-red-500 font-medium">
        ⚠️ {error}
      </div>
    );

  if (!transactions.length)
    return (
      <div className="text-center py-10 text-muted-foreground">
        No transactions found.
      </div>
    );

  const getCategoryName = (category: any): string => {
    if (!category) return "—";
    if (typeof category === "string") return category;
    if (typeof category === "object" && category.name) return category.name;
    return "—";
  };

  return (
    <Card className="shadow-sm border border-border mx-4 md:mx-8 mt-4">
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence>
              {transactions.map((tx) => (
                <motion.tr
                  key={tx._id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="font-medium">
                    {tx.description}
                  </TableCell>

                  <TableCell
                    className={`text-right font-semibold ${
                      tx.type === "Expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ₹ {tx.amount.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        tx.type === "Expense" ? "destructive" : "secondary"
                      }
                      className="capitalize"
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>

                  <TableCell>{getCategoryName(tx.category)}</TableCell>

                  <TableCell>
                    <Badge
                      variant={tx.isActive ? "default" : "outline"}
                      className={`${
                        tx.isActive
                          ? "bg-green-100 text-green-800"
                          : "text-gray-600"
                      }`}
                    >
                      {tx.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={tx.isRecurring ? "secondary" : "outline"}
                      className={`${
                        tx.isRecurring
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-600"
                      }`}
                    >
                      {tx.isRecurring ? "Yes" : "No"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(tx.date || new Date()).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(tx)}
                        className="hover:text-blue-600"
                      >
                        <Edit2 size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete(tx._id!)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
