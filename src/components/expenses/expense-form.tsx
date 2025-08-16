import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { createExpense, updateExpense } from "@/lib/expense-service";
import { Timestamp } from "firebase/firestore";
import PriceInput from "../price-input";

type ExpenseFormInputs = Omit<
  Expense,
  | "date"
  | "id"
  | "user_uid"
  | "user_email"
  | "user_name"
  | "user_image"
  | "transaction_date"
  | "amount"
> & { trxDate: string; amountStr: string };

const expenseInitialState: ExpenseFormInputs = {
  description: "",
  amountStr: "",
  category: "",
  trxDate: format(new Date(), "yyyy-MM-dd"),
  transaction_type: "expense",
};

function getInitialState(expense?: Expense): ExpenseFormInputs {
  if (!expense) {
    return expenseInitialState;
  }
  return {
    description: expense.description,
    amountStr: expense.amount.toString(),
    category: expense.category,
    trxDate: format(expense.transaction_date.toDate(), "yyyy-MM-dd"),
    transaction_type: expense.transaction_type,
  };
}

export function ExpenseForm({
  onSuccess = () => {},
  existingExpense,
}: {
  onSuccess?: () => void;
  existingExpense?: Expense;
}) {
  const { categories, setCategories, query } = useExpense();
  const { user } = useAuth();
  const [expense, setExpense] = useState<ExpenseFormInputs>(
    getInitialState(existingExpense)
  );

  const mutation = useMutation({
    mutationFn: (data: Omit<Expense, "id">) => {
      if (existingExpense) {
        return updateExpense(existingExpense.id, data);
      } else {
        return createExpense(data);
      }
    },
    onMutate: () => {
      const toastMessage = existingExpense
        ? "Updating expense record..."
        : "Creating expense record...";
      const mutationToastId = toast.loading(toastMessage);

      return {
        toastId: mutationToastId,
      };
    },
    onSuccess: (_, __, context) => {
      query.refetch();
      setExpense(expenseInitialState);

      const toastMessage = existingExpense
        ? "Success updating expense record"
        : "Success creating expense record";
      toast.success(toastMessage, {
        id: context.toastId,
      });

      onSuccess();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email || !user.displayName || !user.uid) {
      return;
    }

    const { trxDate, amountStr, ...expenseData } = expense;

    mutation.mutate({
      ...expenseData,
      date: Timestamp.now(),
      transaction_date: Timestamp.fromDate(
        parse(trxDate, "yyyy-MM-dd", new Date())
      ),
      amount: Number(amountStr),
      user_uid: user.uid,
      user_email: user.email,
      user_name: user.displayName,
      user_image: user.photoURL,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <DateInput
          className="w-full"
          date={parse(expense.trxDate, "yyyy-MM-dd", new Date())}
          onChange={(date) => {
            if (date) {
              setExpense({
                ...expense,
                trxDate: format(date, "yyyy-MM-dd") || "",
              });
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Type</Label>
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

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <PriceInput
          id="amount"
          value={expense.amountStr}
          onChange={(value) =>
            setExpense({
              ...expense,
              amountStr: value || "",
            })
          }
        />
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

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? "Processing..."
          : existingExpense
          ? "Update"
          : "Create"}
      </Button>
    </form>
  );
}
