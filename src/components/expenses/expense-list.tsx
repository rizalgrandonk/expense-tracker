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
import { ArrowDown, ArrowUp, MoreHorizontal, Trash } from "lucide-react";
import { cva } from "class-variance-authority";
import { useExpense } from "@/hooks/useExpense";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { deleteExpense } from "@/lib/sheet-service";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ExpenseList() {
  const { expenses, query } = useExpense();
  const { user } = useAuth();

  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(
    undefined
  );
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (data: Expense) => deleteExpense(user!.accessToken, data.date),
    onMutate: () => {
      const mutationToastId = toast.loading("Deleting expense record...");
      return {
        toastId: mutationToastId,
      };
    },
    onSuccess: (_, __, context) => {
      query.refetch();
      toast.success("Success deleting expense record", {
        id: context.toastId,
      });
    },
  });

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
    <>
      <Table containerClassName="rounded-xl border max-h-96 overflow-y-auto relative">
        <TableHeader className="sticky top-0 bg-card">
          <TableRow>
            <TableHead className="font-bold w-[10px]"></TableHead>
            <TableHead className="font-bold">Transaction Date</TableHead>
            <TableHead className="font-bold">Description</TableHead>
            <TableHead className="font-bold">Type</TableHead>
            <TableHead className="font-bold">Amount</TableHead>
            <TableHead className="font-bold">Category</TableHead>
            {/* <TableHead className="font-bold">Created At</TableHead> */}
            <TableHead className="font-bold w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedExpenses.map((expense) => (
            <TableRow key={expense.date}>
              <TableCell></TableCell>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setIsModalDeleteOpen(true);
                      }}
                    >
                      <Trash /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteExpenseDialog
        isOpen={isModalDeleteOpen}
        onOpenChange={(isOpen) => {
          setIsModalDeleteOpen(isOpen);
          if (!isOpen) {
            setSelectedExpense(undefined);
          }
        }}
        onDelete={() =>
          selectedExpense && deleteMutation.mutate(selectedExpense)
        }
      />
    </>
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
        <ArrowUp className="h-4 w-4 m-0 p-0" />
      ) : (
        <ArrowDown className="h-4 w-4 m-0 p-0" />
      )}
      {TYPE_MAP[type]}
    </span>
  );
}

function DeleteExpenseDialog({
  onDelete = () => {},
  isOpen,
  onOpenChange,
}: {
  onDelete?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="text-white cursor-pointer"
              onClick={onDelete}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
