type Props = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

export default function TransactionSummary({ totalIncome, totalExpense, balance }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4 p-4 border-t">
      <div className="text-green-600 font-medium">Total Income: ₹ {totalIncome.toFixed(2)}</div>
      <div className="text-red-600 font-medium">Total Expense: ₹ {totalExpense.toFixed(2)}</div>
      <div className={`font-semibold ${balance >= 0 ? "text-green-700" : "text-red-700"}`}>Balance: ₹ {balance.toFixed(2)}</div>
    </div>
  );
}