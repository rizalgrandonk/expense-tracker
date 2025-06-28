import { format } from "date-fns";
import type { Expense } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";
import UserAvatar from "../user-avatar";

type ExpenseCardProps = {
  expense: Expense;
  className?: string;
};

export function ExpenseCard({ expense, className }: ExpenseCardProps) {
  return (
    <div
      className={cn(
        "expense-card flex items-center justify-between py-2.5",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <UserAvatar
          name={expense.user_name}
          picture={expense.user_image}
          className="h-10 w-10"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold">{expense.category}</span>
          <span className="text-base">{expense.description}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(expense.transaction_date), "dd MMMM yyyy")}
          </span>
        </div>
      </div>
      {expense.transaction_type === "expense" ? (
        <p className="text-right font-bold text-sm text-rose-600">{`- ${formatCurrency(
          expense.amount
        )}`}</p>
      ) : (
        <p className="text-right font-bold text-sm text-emerald-600">{`+ ${formatCurrency(
          expense.amount
        )}`}</p>
      )}
    </div>
  );
}
