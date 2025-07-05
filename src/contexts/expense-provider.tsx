import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { ExpenseProviderContext } from "./expense-context";
import { useQuery } from "@tanstack/react-query";
import { getExpeses } from "@/lib/expense-service";
import {
  groupExpensesByPeriod,
  groupExpensesByUser,
} from "@/lib/expense-utils";

type ExpenseProviderProps = { children: React.ReactNode };

const DEFAULT_CATEGORIES = [
  "Food",
  "Transportation",
  "Housing",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
];

export default function ExpenseProvider({
  children,
  ...props
}: ExpenseProviderProps) {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["expenses"],
    queryFn: () => (user ? getExpeses() : []),
    enabled: !!user,
  });
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const { data: expenses } = query;

  useEffect(() => {
    if (expenses) {
      setCategories((prev) => [
        ...new Set([...expenses.map((item) => item.category), ...prev]),
      ]);
    }
  }, [expenses]);

  const groupedByPeriod = useMemo(
    () => groupExpensesByPeriod(expenses || []),
    [expenses]
  );
  const groupedByUser = useMemo(() => {
    const group = groupExpensesByUser(expenses || []);
    return Object.entries(group).map(([key, value]) => ({
      user_uid: key,
      user_name: value[0].user_name,
      user_email: value[0].user_email,
      user_image: value[0].user_image,
      total_expenses: value.reduce(
        (acc, expense) =>
          acc + (expense.transaction_type === "expense" ? expense.amount : 0),
        0
      ),
      total_income: value.reduce(
        (acc, expense) =>
          acc + (expense.transaction_type === "income" ? expense.amount : 0),
        0
      ),
      expenses: value,
    }));
  }, [expenses]);

  const value = {
    expenses: expenses || [],
    groupedByPeriod,
    groupedByUser,
    categories,
    setCategories: (categories: string[]) => {
      setCategories(categories);
    },
    query,
  };

  return (
    <ExpenseProviderContext.Provider {...props} value={value}>
      {children}
    </ExpenseProviderContext.Provider>
  );
}
