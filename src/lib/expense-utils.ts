import type { Expense } from "@/types";
import { format } from "date-fns";

export function groupExpensesByPeriod(expenses: Expense[]) {
  const groupedExpenses: Record<string, Expense[]> = {};
  expenses.forEach((expense) => {
    const period = format(new Date(expense.transaction_date), "MMMM_yyyy");
    if (groupedExpenses[period]) {
      groupedExpenses[period].push(expense);
    } else {
      groupedExpenses[period] = [expense];
    }
  });
  return groupedExpenses;
}
