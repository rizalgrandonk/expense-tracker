import type { Expense } from "@/types";
import { format } from "date-fns";

export function groupExpensesByPeriod(expenses: Expense[]) {
  const groupedExpenses: Record<string, Expense[]> = {};
  expenses.forEach((expense) => {
    const period = format(expense.transaction_date.toDate(), "MMMM_yyyy");
    if (groupedExpenses[period]) {
      groupedExpenses[period].push(expense);
    } else {
      groupedExpenses[period] = [expense];
    }
  });
  return groupedExpenses;
}

export function groupExpensesByUser(
  expenses: Expense[]
): Record<string, Expense[]> {
  const groupedByUser: Record<string, Expense[]> = {};
  expenses.forEach((expense) => {
    const userKey = `${expense.user_uid}`;
    if (groupedByUser[userKey]) {
      groupedByUser[userKey].push(expense);
    } else {
      groupedByUser[userKey] = [expense];
    }
  });
  return groupedByUser;
}
