export interface Transaction {
  _id?: string;
  userId?: string;
  amount: number;
  type: "Income" | "Expense";
  category: string;
  description: string;
  isRecurring: boolean;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
