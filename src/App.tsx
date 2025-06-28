import { ExpenseForm } from "./components/expenses/expense-form";
import { ExpenseList } from "./components/expenses/expense-list";
import { LoginButton } from "./components/auth/login-button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import { UserButton } from "./components/auth/user-button";
import { DisplayModeToggle } from "./components/DisplayModeToggle";
import { useAuth } from "./hooks/useAuth";
import { useExpense } from "./hooks/useExpense";
import { useState } from "react";
import ExpenseSummary from "./components/expenses/expense-summary";

function App() {
  const { user } = useAuth();
  const { query } = useExpense();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="container mx-auto px-2">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">Expense Tracker</h1>
        <div className="flex items-center gap-2">
          <DisplayModeToggle />
          {user ? <UserButton /> : <LoginButton />}
        </div>
      </header>

      <main>
        {user ? (
          <>
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
              <div className="py-4">
                <SheetTrigger asChild>
                  <Button className="cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Add Expense
                  </Button>
                </SheetTrigger>
              </div>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-semibold text-lg">
                    Add New Expense
                  </SheetTitle>
                </SheetHeader>
                <ExpenseForm onSuccess={() => setIsFormOpen(false)} />
              </SheetContent>
            </Sheet>

            {query.isLoading ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Loading...</h2>
              </div>
            ) : null}
            <ExpenseSummary />
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
    </div>
  );
}

export default App;
