import { useASSharedContext, type ASSharedEntity } from "./AdminSettingsStates";
import { Card, CardContent, CardFooter } from "@sluk/src/components/ui/card";
import type { ErrorResponseType } from "@sluk/src/types/errorResponseType";
import { EmptyState } from "@sluk/src/components/EmptyState";
import { Edit, FileX, Shield, Trash2 } from "lucide-react";
import { Paginator } from "@sluk/src/components/Paginator";
import { Button } from "@sluk/src/components/ui/button";
import { toast } from "sonner";

/** */
type Props = {
  theaders: string[];
};

export function ASSharedList({ theaders }: Props) {
  /** */
  const { changeStates, page, searchTerm, fetchHook } = useASSharedContext();
  /** */
  const {
    isFetching,
    pagination,
    data: entities,
  } = fetchHook(searchTerm, page);

  // HANDLE NOT FOUND
  if (searchTerm && entities.length === 0) {
    return (
      <Card className="my-3.5 p-8">
        <EmptyState
          icon={FileX}
          actionLabel="Reset search"
          title="No Entities found"
          onAction={() => changeStates({ searchTerm: "" })}
          description={`Your search criteria "${searchTerm}" does not match any entities.`}
        />
      </Card>
    );
  }

  return (
    <>
      {/* Content */}
      {entities.length === 0 ? (
        <Card className="my-3.5 p-8">
          <EmptyState
            icon={Shield}
            actionLabel="Add Entity"
            title="No Entities found"
            description="Get started by creating your first entity"
          />
        </Card>
      ) : (
        <Card className="mt-3.5">
          <CardContent>
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {theaders.map((title, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-bold text-xs text-muted-foreground uppercase tracking-wider"
                    >
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entities.map((entity, i) => (
                  <TR key={i} entity={entity} />
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter>
            {pagination && (
              <Paginator
                isFetching={isFetching}
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPrevPage}
                fetchNextPage={() => changeStates({ page: page + 1 })}
                fetchPreviousPage={() => changeStates({ page: page - 1 })}
                onRowsPerPageChange={(limit) => changeStates({ limit })}
              />
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}

/** */
function TR({ entity }: Omit<Props, "theaders"> & { entity: ASSharedEntity }) {
  const { changeStates, deleteHook } = useASSharedContext();
  const { mutateAsync: deleteEntity, isPending: isDeleting } = deleteHook();
  /** */
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        `You are about to delete an entity, are you sure you want to proceed?`,
      )
    )
      return;

    try {
      await deleteEntity(id);
      toast.success("Delete successfully");
    } catch (err: any) {
      const error = err as ErrorResponseType;
      toast.error(error.errorTitle, { description: error.errorMessage });
    }
  };

  /** */
  return (
    <tr className="hover:bg-muted/50">
      <td className="px-4 py-3 text-sm font-medium text-foreground">
        {entity.id}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {entity.title || entity.name}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {entity.description}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            entity.isActive
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {entity.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="flex justify-end gap-2 px-4 py-3 text-right">
        <Button
          size="sm"
          variant="ghost"
          disabled={isDeleting}
          onClick={() =>
            changeStates({
              openDialog: true,
              action: "edit",
              editEntity: entity,
            })
          }
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={isDeleting}
          onClick={() => handleDelete(entity.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
