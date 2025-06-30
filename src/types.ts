export type Expense = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  transaction_date: string;
  transaction_type: "expense" | "income";
  row_number: number;
  user_email: string;
  user_name: string;
  user_image?: string;
};
