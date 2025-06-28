import { ExpenseForm } from "./components/expenses/expense-form";
import { ExpenseList } from "./components/expenses/expense-list";
import { LoginButton } from "./components/auth/login-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { List, Plus, Table } from "lucide-react";
import { UserButton } from "./components/auth/user-button";
import { DisplayModeToggle } from "./components/DisplayModeToggle";
import { useAuth } from "./hooks/useAuth";
import { useExpense } from "./hooks/useExpense";
import { useState } from "react";
import ExpenseSummary from "./components/expenses/expense-summary";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "./hooks/useTheme";
import { format } from "date-fns";
import { Card } from "./components/ui/card";
import { formatCurrency } from "./lib/utils";
import type { Expense } from "./types";
import { useMutation } from "@tanstack/react-query";
import { deleteExpense } from "./lib/sheet-service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ExpenseCardList from "./components/expenses/expense-card-list";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";

function App() {
  const { user } = useAuth();
  const { query, groupedByPeriod: periodExpeses } = useExpense();
  const { theme } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [listType, setListType] = useState<"list" | "table">("list");

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

  const currentMonthExpenses =
    periodExpeses[format(new Date(), "MMMM_yyyy")] || [];
  const totalCurrentMonthExpense = currentMonthExpenses.reduce(
    (acc, expense) =>
      acc + (expense.transaction_type === "expense" ? expense.amount : 0),
    0
  );

  return (
    <div>
      <header className="container mx-auto px-2 flex justify-between items-center py-4 sticky top-0 z-10 bg-background">
        <div className="flex items-center gap-3">
          {user && <UserButton />}
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <Button
              onClick={() => setIsFormOpen(true)}
              variant={"gradient"}
              className="cursor-pointer hidden lg:inline-flex font-bold"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          )}
          <DisplayModeToggle />
          {!user && <LoginButton />}
        </div>
      </header>

      <main className="container mx-auto px-2">
        {user ? (
          <>
            {query.isLoading || !query.data ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Loading...</h2>
              </div>
            ) : null}
            <div className="py-5">
              <Card className="flex flex-col gap-3 justify-center py-5 px-5 border-0 bg-primary-gradient text-white">
                <h3 className="text-lg">Total Monin out this month</h3>
                <div className="text-4xl font-bold">
                  {formatCurrency(totalCurrentMonthExpense)}
                </div>
              </Card>
            </div>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-semibold text-lg">
                    Add New Expense
                  </SheetTitle>
                </SheetHeader>
                <ExpenseForm onSuccess={() => setIsFormOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="py-5 space-y-3">
              <div className="flex justify-between">
                <h2 className="text-lg">Monin Records</h2>
                <ToggleGroup
                  variant="outline"
                  type="single"
                  value={listType}
                  onValueChange={(val) => {
                    setListType(val as "list" | "table");
                  }}
                >
                  <ToggleGroupItem value="list" className="px-3">
                    <List />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="table" className="px-3">
                    <Table />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              {listType === "list" && (
                <ExpenseCardList
                  onActionDelete={(item) => {
                    setSelectedExpense(item);
                    setIsModalDeleteOpen(true);
                  }}
                />
              )}
              {listType === "table" && (
                <ExpenseList
                  onActionDelete={(item) => {
                    setSelectedExpense(item);
                    setIsModalDeleteOpen(true);
                  }}
                />
              )}
            </div>

            <div className="py-5">
              <ExpenseSummary />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              Please login to track your expenses
            </h2>
            <LoginButton />
          </div>
        )}
      </main>

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

      <Toaster theme={theme} position="top-center" />
    </div>
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

export default App;
