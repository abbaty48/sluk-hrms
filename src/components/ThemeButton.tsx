import { Button } from "@/components/ui/button";
import { Moon, SunMoon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant={"ghost"}
      onClick={toggleTheme}
      className="-m-1 hover:bg-primary/50"
    >
      {theme === "dark" ? (
        <SunMoon onClick={toggleTheme} />
      ) : (
        <Moon onClick={toggleTheme} />
      )}
    </Button>
  );
}
