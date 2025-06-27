import { ExpenseProviderContext } from "@/contexts/expense-context";
import { useContext } from "react";

export const useExpense = () => {
  const context = useContext(ExpenseProviderContext);
  if (context === undefined)
    throw new Error("useExpense must be used within a ExpenseProvider");
  return context;
};
