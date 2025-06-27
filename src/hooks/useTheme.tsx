import { ThemeProviderContext } from "@/contexts/theme-context";
import type { ThemeProviderState } from "@/contexts/ThemeProvider";
import { useContext } from "react";

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
