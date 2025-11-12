export const TransactionType = {
  INCOME: "Income",
  EXPENSE: "Expense",
} as const;

export const TransactionFrequency = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];
export type TransactionFrequency =
  (typeof TransactionFrequency)[keyof typeof TransactionFrequency];
export interface ITransaction {
  _id?: string;
  userId: string | null;
  amount: number;
  type: TransactionType;
  categoryId: {
    _id: string;
    name: string;
    type: TransactionType;
  };
  description: string;
  isRecurring?: boolean;
  frequency?: TransactionFrequency | string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
