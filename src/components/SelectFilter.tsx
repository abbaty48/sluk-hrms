import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";

type FilterProps = {
  value?: string | undefined;
  placeholder?: ReactNode;
  children: React.ReactNode;
  defaultValue?: string | undefined;
  onValueChange: (value?: string) => void;
};

export function SelectFilter({
  children,
  value,
  placeholder,
  defaultValue,
  onValueChange,
  ...props
}: FilterProps) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      {...props}
    >
      <SelectTrigger className="w-full">
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
