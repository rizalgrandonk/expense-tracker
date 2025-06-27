import type { Expense } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { cn, formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cva } from "class-variance-authority";

type ExpenseListProps = {
  expenses: Expense[];
};

export function ExpenseList({ expenses }: ExpenseListProps) {
  const sortedExpenses = expenses.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Transaction Date</TableHead>
          <TableHead className="font-bold">Description</TableHead>
          <TableHead className="font-bold">Type</TableHead>
          <TableHead className="font-bold">Amount</TableHead>
          <TableHead className="font-bold">Category</TableHead>
          <TableHead className="font-bold">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedExpenses.map((expense) => (
          <TableRow key={expense.date}>
            <TableCell>
              {format(new Date(expense.transaction_date), "dd MMM, yyyy")}
            </TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>
              <TypeBadge type={expense.transaction_type} />
            </TableCell>
            <TableCell className="font-semibold">
              {formatCurrency(expense.amount)}
            </TableCell>
            <TableCell>{expense.category}</TableCell>
            <TableCell>
              {format(new Date(expense.date), "dd MMM, yyyy HH:mm")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const TYPE_MAP = {
  expense: "Expense",
  income: "Income",
};

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded px-3 py-1.5 font-medium leading-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        expense: "text-rose-600 bg-rose-600/10",
        income: "text-teal-600 bg-teal-600/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
function TypeBadge({ type }: { type: Expense["transaction_type"] }) {
  return (
    <span className={cn(badgeVariants({ variant: type }))}>
      {type === "expense" ? (
        <ArrowDown className="h-4 w-4 m-0 p-0" />
      ) : (
        <ArrowUp className="h-4 w-4 m-0 p-0" />
      )}
      {TYPE_MAP[type]}
    </span>
  );
}
