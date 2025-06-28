import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appendExpense } from "@/lib/sheet-service";
import type { Expense } from "@/types";
import DateInput from "../date-input";
import { ComboInput } from "../combo-input";
import { useExpense } from "@/hooks/useExpense";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { format, parse } from "date-fns";

const expenseInitialState: Omit<Expense, "date"> = {
  description: "",
  amount: 0,
  category: "",
  transaction_date: format(new Date(), "yyyy-MM-dd"),
  transaction_type: "expense",
  row_number: 0,
};

export function ExpenseForm({
  onSuccess = () => {},
}: {
  onSuccess?: () => void;
}) {
  const { categories, setCategories, query } = useExpense();
  const { user } = useAuth();
  const [expense, setExpense] =
    useState<Omit<Expense, "date">>(expenseInitialState);

  const mutation = useMutation({
    mutationFn: (data: Expense) => appendExpense(user!.accessToken, data),
    onMutate: () => {
      const mutationToastId = toast.loading("Creating expense record...");
      return {
        toastId: mutationToastId,
      };
    },
    onSuccess: (_, __, context) => {
      query.refetch();
      setExpense(expenseInitialState);
      toast.success("Success creating expense record", {
        id: context.toastId,
      });
      onSuccess();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    mutation.mutate({
      ...expense,
      date: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <DateInput
          className="w-full"
          date={parse(expense.transaction_date, "yyyy-MM-dd", new Date())}
          onChange={(date) => {
            if (date) {
              setExpense({
                ...expense,
                transaction_date: format(date, "yyyy-MM-dd") || "",
              });
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Select
          value={expense.transaction_type}
          onValueChange={(value) =>
            setExpense({
              ...expense,
              transaction_type: value as "expense" | "income",
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="expense"
              className="flex items-center font-medium text-rose-600 bg-rose-600/10 hover:bg-rose-600/20 hover:text-rose-600"
            >
              <ArrowUp className="text-rose-600" />
              <span>Expense</span>
            </SelectItem>
            <SelectItem
              value="income"
              className="flex items-center font-medium text-teal-600 bg-teal-600/10 hover:bg-teal-600/20 hover:text-teal-600"
            >
              <ArrowDown className="text-teal-600" />
              <span>Income</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={expense.description}
          onChange={(e) =>
            setExpense({ ...expense, description: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={expense.amount}
          onChange={(e) =>
            setExpense({ ...expense, amount: Number(e.target.value) })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <ComboInput
          options={categories}
          value={expense.category}
          onChange={(category) => setExpense({ ...expense, category })}
          onAddCustom={(newCategory) => {
            setCategories([...new Set([...categories, newCategory])]);
          }}
        />
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Processing..." : "Add Expense"}
      </Button>
    </form>
  );
}
