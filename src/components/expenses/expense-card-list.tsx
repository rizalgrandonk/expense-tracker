import { useExpense } from "@/hooks/useExpense";
import type { Expense } from "@/types";
import { ExpenseCard } from "./expense-card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function ExpenseCardList({
  onActionDelete = () => {},
  onActionEdit = () => {},
}: {
  onActionDelete?: (expense: Expense) => void;
  onActionEdit?: (expense: Expense) => void;
}) {
  const { expenses, query } = useExpense();

  if (query.error) {
    return (
      <div className="h-96">
        <Alert variant="destructive" className="">
          <AlertCircleIcon />
          <AlertTitle>Unable to get data.</AlertTitle>
          <AlertDescription>
            <p>{query.error.message}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!query.data) {
    return (
      <div className="grid lg:grid-cols-2 gap-x-8 divide-y [&_.expense-card:last-child]:border-b max-h-96 overflow-y-auto px-1">
        {Array.from({ length: 10 }).map(() => (
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 py-2.5">
              <Skeleton className="h-3.5 w-[150px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-x-8 divide-y [&_.expense-card:last-child]:border-b max-h-96 overflow-y-auto px-1">
      {expenses.map((expense) => (
        <Popover key={expense.id}>
          <PopoverTrigger asChild>
            <button className="block text-left cursor-pointer hover:bg-accent px-1">
              <ExpenseCard key={expense.id} expense={expense} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="space-y-4">
            <p className="leading-none font-medium">Actions</p>
            <div className="space-y-2">
              <Button
                variant={"outline"}
                size={"sm"}
                className="w-full cursor-pointer"
                onClick={() => {
                  onActionEdit(expense);
                }}
              >
                Edit
              </Button>
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
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
