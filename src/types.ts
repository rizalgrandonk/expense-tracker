import type { Timestamp } from "firebase/firestore";

export type Expense = {
  id: string;
  date: Timestamp;
  description: string;
  amount: number;
  category: string;
  transaction_date: Timestamp;
  transaction_type: "expense" | "income";
  user_uid: string;
  user_email: string;
  user_name: string;
  user_image: string | null;
};
