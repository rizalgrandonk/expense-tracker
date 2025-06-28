import { useExpense } from "@/hooks/useExpense";
import type { Expense } from "@/types";
import { ExpenseCard } from "./expense-card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export default function ExpenseCardList({
  onActionDelete = () => {},
}: {
  onActionDelete?: (expense: Expense) => void;
}) {
  const { expenses } = useExpense();

  const sortedExpenses = expenses.sort((a, b) => {
    const compareTrxDate =
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime();

    if (compareTrxDate !== 0) {
      return compareTrxDate;
    }

    const compateDate = new Date(b.date).getTime() - new Date(a.date).getTime();

    return compateDate;
  });

  return (
    <div className="grid lg:grid-cols-2 gap-x-8 divide-y [&_.expense-card:last-child]:border-b max-h-96 overflow-y-auto px-1">
      {sortedExpenses.map((expense) => (
        <Popover key={expense.date}>
          <PopoverTrigger asChild>
            <button className="block text-left cursor-pointer hover:bg-accent px-1">
              <ExpenseCard key={expense.date} expense={expense} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="space-y-4">
            <p className="leading-none font-medium">Actions</p>
            <Button
              variant={"destructive"}
              size={"sm"}
              className="w-full cursor-pointer"
              onClick={() => {
                onActionDelete(expense);
              }}
            >
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
