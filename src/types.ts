export type Expense = {
  date: string;
  description: string;
  amount: number;
  category: string;
  transaction_date: string;
  transaction_type: "expense" | "income";
};
