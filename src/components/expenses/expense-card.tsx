import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";

type ExpenseCardProps = {
  expense: Expense;
};

export function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {expense.description}
        </CardTitle>
        <span className="text-sm text-muted-foreground">
          {format(new Date(expense.date), "dd MMM, yyyy HH:mm")}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <span className="text-2xl font-bold">
            {formatCurrency(expense.amount)}
          </span>
          <span className="text-sm text-muted-foreground">
            {expense.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
