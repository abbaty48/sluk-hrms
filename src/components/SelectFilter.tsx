import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@sluk/src/components/ui/select";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import { QueryErrorBoundary } from "@sluk/src/components/ErrorBoundary";

type FilterProps = {
  placeholder?: string;
  children: React.ReactNode;
  defaultValue?: string | undefined;
  onValueChange: (value?: string) => void;
};

export function SelectFilter({
  children,
  placeholder,
  defaultValue,
  onValueChange,
  ...props
}: FilterProps) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      {...props}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <QueryErrorBoundary>
          <Suspense
            fallback={
              <SelectItem className="flex items-center gap-2" value="all">
                <Loader className="animate-spin" /> Loading...
              </SelectItem>
            }
          >
            {children}
          </Suspense>
        </QueryErrorBoundary>
      </SelectContent>
    </Select>
  );
}
