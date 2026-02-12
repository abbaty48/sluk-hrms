import { use } from "react";
import { ThemeProviderContext } from "@/states/contexts/themeContext";

export const useTheme = () => {
  const context = use(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
