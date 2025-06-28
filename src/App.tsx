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
import { Plus } from "lucide-react";
import { UserButton } from "./components/auth/user-button";
import { DisplayModeToggle } from "./components/DisplayModeToggle";
import { useAuth } from "./hooks/useAuth";
import { useExpense } from "./hooks/useExpense";
import { useState } from "react";
import ExpenseSummary from "./components/expenses/expense-summary";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { user } = useAuth();
  const { query } = useExpense();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div>
      <header className="container mx-auto px-2 flex justify-between items-center py-4 sticky top-0 z-10 bg-background">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="cursor-pointer hidden lg:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
          <DisplayModeToggle />
          {user ? <UserButton /> : <LoginButton />}
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
            <ExpenseSummary />

            <div className="py-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
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

            <div className="py-4 space-y-2">
              <h2 className="text-xl font-semibold">List Transaction</h2>
              <ExpenseList />
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

      <Toaster theme={theme} position="top-center" />
    </div>
  );
}

export default App;
