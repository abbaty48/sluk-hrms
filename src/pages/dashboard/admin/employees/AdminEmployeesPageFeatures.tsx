import { cn } from "@sluk/src/lib/utils";
import { Button } from "@sluk/src/components/ui/button";
import { LucideDownload, LucideImport, LucidePlus } from "lucide-react";

type Align = "right" | "left" | "center";

function placement(align: Align) {
  switch (align) {
    case "right":
      return "place-self-end";
    case "left":
      return "place-self-start";
    case "center":
      return "place-self-center";
  }
}

export function AdminEmployeesPageFeatures({
  align,
}: {
  align: "right" | "left" | "center";
}) {
  return (
    <menu className={cn("flex items-center gap-2 list-none", placement(align))}>
      <Button
        variant={"outline"}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
      >
        <LucideImport />
        Import CSV
      </Button>

      <Button
        variant={"outline"}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
      >
        <LucideDownload />
        Export
      </Button>

      <Button
        variant={"outline"}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground dark:text-inherit hover:bg-primary/90 h-9 rounded-md px-3"
      >
        <LucidePlus />
        Add Staff
      </Button>
    </menu>
  );
}
