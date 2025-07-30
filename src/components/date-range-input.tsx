import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar1Icon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import type { DateRange } from "react-day-picker";

export default function DateRangeInput({
  dateRange,
  onChange,
  className,
}: {
  dateRange: DateRange | undefined;
  onChange: (dateRange: DateRange | undefined) => void;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-range"
          className={cn("w-48 justify-between font-normal", className)}
        >
          {dateRangePreview(dateRange)}
          <Calendar1Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          captionLayout="dropdown"
          onSelect={(dateRange) => {
            if (!dateRange || !dateRange.from || !dateRange.to) {
              return;
            }
            onChange(dateRange);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function dateRangePreview(
  dateRange?: DateRange,
  placeholder = "Select Date"
) {
  if (!dateRange || !dateRange.from || !dateRange.to) {
    return placeholder;
  }

  const startStr = format(dateRange.from, "dd MMM, yyyy");
  const endStr = format(dateRange.to, "dd MMM, yyyy");

  return `${startStr} - ${endStr}`;
}
