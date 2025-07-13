import { cn } from "@/lib/utils";
import CurrencyInput from "react-currency-input-field";

type PriceInputProps = {
  value?: string;
  id?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  className?: string;
  currencySymbol?: string;
};

export default function PriceInput({
  value,
  id,
  onChange = () => {},
  placeholder,
  currencySymbol = "Rp",
  className,
}: PriceInputProps) {
  return (
    <div className={cn("flex items-stretch", className)}>
      <span className="bg-muted px-3 inline-flex items-center rounded-l-md border-input">
        {currencySymbol}
      </span>
      <CurrencyInput
        id={id}
        placeholder={placeholder}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "rounded-l-none"
        )}
        value={value}
        onValueChange={(val) => onChange(val || "")}
        decimalSeparator=","
        groupSeparator="."
      />
      {/* <Input
        id={id}
        type="text"
        inputMode="numeric"
        value={inputValue}
        className="rounded-l-none"
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        required
      /> */}
    </div>
  );
}
