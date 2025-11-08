import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";

type Props = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export default function TransactionSummary({
  totalIncome,
  totalExpense,
  balance,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 px-4 md:px-8">
      {/* Total Income */}
      <Card className="border border-border shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ₹ {totalIncome.toFixed(2)}
            </p>
          </div>
          <ArrowUpCircle className="text-green-500" size={28} />
        </CardContent>
      </Card>

      {/* Total Expense */}
      <Card className="border border-border shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">
              ₹ {totalExpense.toFixed(2)}
            </p>
          </div>
          <ArrowDownCircle className="text-red-500" size={28} />
        </CardContent>
      </Card>

      {/* Balance */}
      <Card className="border border-border shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium">Balance</p>
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              ₹ {balance.toFixed(2)}
            </p>
          </div>
          <Wallet
            className={balance >= 0 ? "text-green-600" : "text-red-600"}
            size={28}
          />
        </CardContent>
      </Card>
    </div>
  );
}
