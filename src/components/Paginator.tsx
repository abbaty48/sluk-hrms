import {
  Pagination,
  PaginationItem,
  PaginationContent,
} from "@/components/ui/pagination";
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  isFetching: boolean;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  onRowsPerPageChange: (value: string) => void;
};

export function Paginator({
  isFetching,
  totalPages,
  currentPage,
  hasNextPage,
  fetchNextPage,
  hasPreviousPage,
  fetchPreviousPage,
  onRowsPerPageChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 m-auto">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select defaultValue="5" onValueChange={onRowsPerPageChange}>
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchPreviousPage}
              disabled={!hasPreviousPage || isFetching}
            >
              <ChevronLeft />
              Previous
            </Button>
          </PaginationItem>
          <span className="text-sm font-medium text-muted-foreground">
            ({currentPage} of {totalPages})
          </span>
          <PaginationItem>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchNextPage}
              disabled={!hasNextPage || isFetching}
            >
              Next
              <ChevronRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
