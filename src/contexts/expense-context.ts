import type { Expense } from "@/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";

export const ExpenseProviderContext = createContext<{
  query: UseQueryResult<Expense[], Error>;
  expenses: Expense[];
  categories: string[];
  setCategories: (categories: string[]) => void;
  groupedByPeriod: Record<string, Expense[]>;
}>({
  query: {} as UseQueryResult<Expense[], Error>,
  expenses: [],
  categories: [],
  setCategories: () => {},
  groupedByPeriod: {},
});
