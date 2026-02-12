import { createContext } from "react";
import type { Theme } from "@/states/providers/ThemeProvider";

type ThemeProviderState = {
  theme: Theme;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  toggleTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);
