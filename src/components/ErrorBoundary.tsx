import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ChevronDownIcon, MessageSquareWarning } from "lucide-react";

export function QueryErrorBoundary({
  message,
  children,
}: {
  message?: ReactNode;
  children: ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="flex flex-col items-center justify-center-safe gap-4 text-center text-destructive p-4 mx-auto">
              <header>
                <h2>
                  {message ?? (
                    <>
                      <MessageSquareWarning /> Whoops, something went wrong
                      getting data's here.
                    </>
                  )}
                </h2>
                <Button
                  variant={"default"}
                  onClick={() => {
                    resetErrorBoundary();
                  }}
                  className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/50 cursor-pointer"
                >
                  Try again.
                </Button>
              </header>
              <Collapsible className="data-[state=open]:bg-muted rounded-md">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="group w-full rounded-bl-0">
                    Error details
                    <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 pt-0 text-sm">
                  <p className="p-3">
                    Reason: {String(error)}, if the error persist, please
                    contact the developers.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
