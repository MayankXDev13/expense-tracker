import { Types } from "mongoose";


export enum TransactionType {
  INCOME = "Income",
  EXPENSE = "Expense",
}


export enum TransactionFrequency {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly",
  YEARLY = "Yearly",
}


export interface ITransaction {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  type: TransactionType;
  categoryId: Types.ObjectId | null;
  description: string;
  isRecurring?: boolean;
  frequency?: TransactionFrequency | string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
