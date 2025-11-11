export interface IBudget {
  _id: string;
  categoryId: string | null;
  limitAmount: number;
  isGlobal: boolean;
  spentAmount: number;
  isExceeded: boolean;
  alertThreshold: number;
  period: string;
  startDate: string;
  endDate: string;
}