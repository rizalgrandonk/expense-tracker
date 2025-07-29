import type { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import DateRangeInput, { dateRangePreview } from "./date-range-input";
import { getExpesesWithinDateRange } from "@/lib/expense-service";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import { startOfDay } from "date-fns/startOfDay";
import { endOfDay } from "date-fns/endOfDay";
import { exportExpensesToExcel } from "@/lib/xlsx";
import { format } from "date-fns/format";

export default function ExportModal({
  isOpen,
  onOpenChange,
}: {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  async function submitHandler() {
    setIsSubmitLoading(true);

    if (!dateRange || !dateRange.from || !dateRange.to) {
      toast.error("Please select date range");
      setIsSubmitLoading(false);
      return;
    }
    const expenseData = await getExpesesWithinDateRange(
      Timestamp.fromDate(startOfDay(dateRange.from)),
      Timestamp.fromDate(endOfDay(dateRange.to))
    );

    if (!expenseData || expenseData.length < 1) {
      toast.error("Data expenses not found");
      setIsSubmitLoading(false);
      return;
    }

    const exportData = expenseData.map((item) => ({
      "Transaction Date": format(
        item.transaction_date.toDate(),
        "dd MMMM, yyyy"
      ),
      Name: item.user_name,
      Description: item.description,
      Amount: item.amount,
      Category: item.category,
      "Transaction Type":
        item.transaction_type === "expense" ? "Expense" : "Income",
    }));

    exportExpensesToExcel(exportData, `${dateRangePreview(dateRange)}.xlsx`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form onSubmit={submitHandler}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Monin Data</DialogTitle>
            <DialogDescription>
              Select date range for exporting data
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="grid gap-2">
              <Label htmlFor="date-range">Date Range</Label>
              <DateRangeInput
                className="w-full"
                dateRange={dateRange}
                onChange={(dateRange) => {
                  setDateRange(dateRange);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isSubmitLoading}
              onClick={submitHandler}
            >
              {isSubmitLoading ? "Proccessing..." : "Export Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
