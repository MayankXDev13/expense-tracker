import { Button } from "@/components/ui/button"; 
import { Edit2, Trash2 } from "lucide-react";
import { type Transaction } from "./TransactionManager";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  loading: boolean;
  error: string | null;
};

const rowVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

export default function TransactionTable({ transactions, onEdit, onDelete, loading, error }: Props) {
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-4">{error}</div>;
  if (!transactions.length) return <div className="text-center text-gray-500 py-4">No transactions found</div>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Active</th>
            <th className="px-4 py-2 text-left">Recurring</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <AnimatePresence>
            {transactions.map((tx) => (
              <motion.tr
                key={tx._id}
                layout
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.18 }}
              >
                <td className="px-4 py-2">{tx.description}</td>
                <td className={`px-4 py-2 text-right ${tx.type === "Expense" ? "text-red-600" : "text-green-600"}`}>₹ {tx.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{tx.type}</td>
                <td className="px-4 py-2">{tx.category}</td>
                <td className="px-4 py-2">{tx.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{tx.isRecurring ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(tx)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(tx._id)}>
                    <Trash2 size={16} />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
