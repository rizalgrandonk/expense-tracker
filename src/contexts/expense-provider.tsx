import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { ExpenseProviderContext } from "./expense-context";
import { useQuery } from "@tanstack/react-query";
import { getExpesesData } from "@/lib/expense-service";

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
  const { user, setUser } = useAuth();
  const query = useQuery({
    queryKey: ["expenses"],
    queryFn: () => (user ? getExpesesData(user.accessToken) : []),
    enabled: !!user,
    retry(_, error) {
      if (error.message === "Unauthorized") {
        setUser(null);
        return false;
      }
      return true;
    },
  });
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const { data: expenses, error } = query;

  useEffect(() => {
    if (expenses) {
      setCategories((prev) => [
        ...new Set([...expenses.map((item) => item.category), ...prev]),
      ]);
    }
  }, [expenses]);

  useEffect(() => {
    if (error && error.message === "Unauthorized") {
      setUser(null);
    }
  }, [error, setUser]);

  const value = {
    expenses: expenses || [],
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
