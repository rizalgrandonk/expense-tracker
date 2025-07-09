import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { ExpenseProviderContext } from "./expense-context";
import { useQuery } from "@tanstack/react-query";
import { getExpeses } from "@/lib/expense-service";
import { groupExpensesByPeriod } from "@/lib/expense-utils";

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

  const value = {
    expenses: expenses || [],
    groupedByPeriod,
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
