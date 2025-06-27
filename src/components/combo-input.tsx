// src/components/expenses/category-combobox.tsx
import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ComboInput = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onAddCustom?: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export function ComboInput({
  value,
  options,
  className,
  placeholder,
  onChange,
  onAddCustom = () => {},
}: ComboInput) {
  const [open, setOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState<string[]>([]);

  const allOptions = [...new Set([...options, ...customOptions])];

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const handleAddCustom = (inputValue: string) => {
    if (inputValue && !options.includes(inputValue)) {
      setCustomOptions([...customOptions, inputValue]);
      onAddCustom(inputValue);
    }
    onChange(inputValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value || placeholder || "Select ..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={placeholder || "Select ..."} />
          <CommandList>
            <CommandEmpty>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() =>
                  handleAddCustom(
                    (document.querySelector("[cmdk-input]") as HTMLInputElement)
                      ?.value || ""
                  )
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new category
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {allOptions.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
