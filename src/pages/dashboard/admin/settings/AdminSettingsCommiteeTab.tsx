import type {
  TCommittee,
  TCreateCommitteeRequest,
} from "@/types/committeeTypes";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useCommitteeApi,
  useDeleteCommittee,
} from "@/hooks/api/useAdminSettingsAPI";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Paginator } from "@sluk/src/components/Paginator";
import { useDebounce } from "@sluk/src/hooks/use-debounce";
import { EmptyState } from "@sluk/src/components/EmptyState";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Field, FieldLabel } from "@sluk/src/components/ui/field";
import type { ErrorResponseType } from "@sluk/src/types/errorResponseType";
import { Plus, Edit, UsersRound, Search, Trash, FilterX } from "lucide-react";

type TState = {
  limit: string;
  page: number;
  isFilter: boolean;
  term: string | undefined;
  actives: boolean | undefined;
};

/** */
export function AdminSettingsCommitteesTab() {
  const [filter, setFilter] = useState<TState>({
    limit: "5",
    page: 1,
    isFilter: false,
    term: undefined,
    actives: undefined,
  });

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingCommittee, setEditingCommittee] = useState<TCommittee | null>(
    null,
  );
  /** */
  const changeFitler = (state: Partial<TState>) => {
    setFilter((prev) => ({
      ...prev,
      ...state,
      isFilter: state.term !== undefined || state.actives !== undefined,
    }));
  };
  /** */
  const resetFilter = () =>
    changeFitler({ isFilter: false, actives: undefined, term: undefined });
  /** */
  const handleCreate = () => setIsDialogOpen(true);

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Committees
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage organizational committees and working groups
            </p>
          </div>
          <Button onClick={handleCreate} disabled={filter.isFilter}>
            <Plus className="h-4 w-4 mr-1" />
            Add Committee
          </Button>
        </div>
        {/*SEARCH*/}
        <Card>
          <CardContent className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Search size={"18"} />
              <Input
                type="search"
                value={filter.term ?? ""}
                placeholder="Search communities..."
                onChange={(e) => changeFitler({ term: e.currentTarget.value })}
              />
            </div>
            {/*show filter*/}
            {filter.isFilter && (
              <Button variant={"ghost"} onClick={resetFilter}>
                <FilterX />
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
        {/*<SearchCommittee term={filter.term} changeFitler={changeFitler} />*/}
        {/* COMMITTEES */}
        <QueryErrorResetBoundary>
          <Suspense fallback={<TableSkeleton />}>
            <CommitteeList
              filter={filter}
              changeFitler={changeFitler}
              handleCreate={handleCreate}
              setIsDialogOpen={setIsDialogOpen}
              setEditingCommittee={setEditingCommittee}
            />
          </Suspense>
        </QueryErrorResetBoundary>
      </div>
      {/* Create/Edit Dialog */}
      <CommitteeDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingCommittee={editingCommittee}
      />
    </>
  );
}

/**
 *
 */
function TR({
  c,
  setIsDialogOpen,
  setEditingCommittee,
}: {
  c: TCommittee;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCommittee: React.Dispatch<React.SetStateAction<TCommittee | null>>;
}) {
  const { mutateAsync: deleteCommittee } = useDeleteCommittee();

  const handleEdit = (committee: TCommittee) => {
    setEditingCommittee(committee);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteCommittee(id);
      toast.success("Committee deleted successfully");
    } catch {
      toast.error("Failed to delete committee");
    }
  };

  return (
    <tr key={c.id} className="p-3 h-5 border-b border-border last:border-0 ">
      <td className="py-3 px-4">{c.id}</td>
      <td className="py-3 px-4">{c.name}</td>
      <td className="py-3 px-4">{c.abbre || "N/A"}</td>
      <td className="py-3 px-4">{c.description || "N/A"}</td>
      <td className="py-3 px-4">
        {c.isActive ? (
          <span className="text-success-foreground bg-success-bg py-1 px-3 font-bold rounded-2xl text-xs">
            Active
          </span>
        ) : (
          <span>Not Active</span>
        )}
      </td>
      <td className="py-3 px-4 flex items-center justify-between">
        <Button variant={"ghost"} onClick={() => handleEdit(c)}>
          <Edit />
        </Button>
        <Button variant={"ghost"} onClick={() => handleDelete(c.id, c.name)}>
          <Trash />
        </Button>
      </td>
    </tr>
  );
}

/**
 * Committee Table List
 */
export function CommitteeList({
  filter,
  setIsDialogOpen,
  setEditingCommittee,
  handleCreate,
  changeFitler,
}: {
  filter: TState;
  handleCreate: () => void;
  changeFitler: (state: Partial<TState>) => void;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingCommittee: React.Dispatch<React.SetStateAction<TCommittee | null>>;
}) {
  const term = useDebounce(filter.term!, 1000);

  const {
    isFetching,
    pagination,
    data: committees,
  } = useCommitteeApi().useCommittees({ ...filter, term });

  // Handle filter not found
  if (committees.length <= 0 && filter.isFilter) {
    return (
      <EmptyState
        icon={FilterX}
        title="Not found"
        actionLabel="Reset filter"
        description={`Could not find any committee base on your criteria.`}
        onAction={() =>
          changeFitler({ ...filter, actives: undefined, term: undefined })
        }
      />
    );
  }

  return committees.length === 0 ? (
    <Card className="stats-card p-8">
      <EmptyState
        icon={UsersRound}
        onAction={handleCreate}
        title="No committees found"
        actionLabel="Add Committee"
        description="Get started by creating your first committee"
      />
    </Card>
  ) : (
    <Card>
      <CardContent className="space-y-3">
        <table className="text-sm w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                S/N
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                NAME
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                ABBREVIATION
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                DESCRIPTION
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                STATUS
              </th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {committees.map((c) => (
              <TR
                c={c}
                key={c.id}
                setIsDialogOpen={setIsDialogOpen}
                setEditingCommittee={setEditingCommittee}
              />
            ))}
          </tbody>
        </table>
        {pagination && (
          <Paginator
            isFetching={isFetching}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            fetchNextPage={() => changeFitler({ page: filter.page + 1 })}
            fetchPreviousPage={() => changeFitler({ page: filter.page - 1 })}
            hasPreviousPage={pagination.hasPrevPage}
            onRowsPerPageChange={(limit) => changeFitler({ limit })}
          />
        )}
      </CardContent>
    </Card>
  );
}

/**
 * CommitteDialog
 */
function CommitteeDialog({
  isDialogOpen,
  setIsDialogOpen,
  editingCommittee,
}: {
  isDialogOpen: boolean;
  editingCommittee: TCommittee | null;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, defaultValues },
  } = useForm<TCreateCommitteeRequest>({
    defaultValues: {
      name: editingCommittee?.name,
      abbre: editingCommittee?.abbre || undefined,
      description: editingCommittee?.description || undefined,
    },
  });
  /**
   *
   */
  const { useCreateCommittee, useUpdateCommittee } = useCommitteeApi();
  /**
   *
   */
  const { mutateAsync: createCommittee, isPending: isCreating } =
    useCreateCommittee();
  /**
   *
   */
  const { mutateAsync: updateCommittee, isPaused: isUpdating } =
    useUpdateCommittee();

  const handleSave = async (formData: TCreateCommitteeRequest) => {
    try {
      if (editingCommittee) {
        await updateCommittee({
          id: editingCommittee.id,
          data: formData,
        });
        toast.success("Committee updated successfully");
      } else {
        await createCommittee(formData);
        toast.success("Committee created successfully");
      }
      setIsDialogOpen(false);
    } catch (err) {
      const error = err as ErrorResponseType;
      toast.error(error.errorTitle, {
        description: `Failed to ${editingCommittee ? "update" : "create"} committee`,
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingCommittee ? "Edit Committee" : "Add Committee"}
          </DialogTitle>
          <DialogDescription>
            {editingCommittee
              ? "Update the committee information"
              : "Create a new committee"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSave)}
          className="space-y-4 max-h-[60vh] overflow-y-auto px-1"
        >
          {/*NAME*/}
          <Field className="space-y-2">
            <FieldLabel>Committee Name</FieldLabel>
            <Input
              value={defaultValues?.name}
              placeholder="e.g., Academic Board Committee"
              {...register("name", {
                required: "Provide the committee name.",
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </Field>
          {/*ABBRE*/}
          <Field className="space-y-2">
            <FieldLabel>Abbreviation Name</FieldLabel>
            <Input
              placeholder="e.g. AB"
              {...register("abbre")}
              value={defaultValues?.abbre}
            />
          </Field>
          {/*DESCRIPTION*/}
          <Field className="space-y-2">
            <FieldLabel htmlFor="description">
              Description (Optional)
            </FieldLabel>
            <Textarea
              id="description"
              rows={3}
              value={defaultValues?.description}
              placeholder="Detailed description of the committee's role and responsibilities"
              {...register("description")}
            />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isCreating || isUpdating}
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** */
function TableSkeleton() {
  return (
    <Card className="stats-card overflow-hidden">
      {/* Table Header */}
      <table className="text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
              S/N
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
              NAME
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
              ABBREVIATION
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
              DESCRIPTION
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
              STATUS
            </th>
            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider py-3 px-4">
              ACTIONS
            </th>
          </tr>
        </thead>
      </table>
      {/* Table Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-2 px-4 flex justify-between gap-4 border-b border-border last:border-b-0"
        >
          <div className="h-4 w-full rounded shimmer" />
          <div className="w-full h-4 rounded shimmer" />
          <div className="h-4 w-full rounded shimmer" />
          <div className="w-full h-4 rounded shimmer" />
          <div className="w-full h-4 rounded shimmer" />
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded shimmer" />
            <div className="h-8 w-8 rounded shimmer" />
          </div>
        </div>
      ))}
    </Card>
  );
}
