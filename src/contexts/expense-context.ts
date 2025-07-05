import type { Expense } from "@/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";

export const ExpenseProviderContext = createContext<{
  query: UseQueryResult<Expense[], Error>;
  expenses: Expense[];
  categories: string[];
  setCategories: (categories: string[]) => void;
  groupedByPeriod: Record<string, Expense[]>;
  groupedByUser: {
    user_uid: string;
    user_name: string;
    user_email: string;
    user_image: string | null;
    total_expenses: number;
    total_income: number;
    expenses: Expense[];
  }[];
}>({
  query: {} as UseQueryResult<Expense[], Error>,
  expenses: [],
  categories: [],
  setCategories: () => {},
  groupedByPeriod: {},
  groupedByUser: [],
});
