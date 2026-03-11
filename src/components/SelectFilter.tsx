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
  name?: string;
  value?: string | undefined;
  placeholder?: ReactNode;
  children: React.ReactNode;
  triggerClassName?: string;
  defaultValue?: string | undefined;
  onValueChange: (value?: string) => void;
};

export function SelectFilter({
  name,
  value,
  children,
  placeholder,
  defaultValue,
  onValueChange,
  triggerClassName,
}: FilterProps) {
  return (
    <Select
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={triggerClassName}>
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
