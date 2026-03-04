import type {
  TDepartment,
  TDepartmentCreateRequest,
} from "@sluk/src/types/departmentTypes";
import {
  useCreateDepartment,
  useDeleteDepartment,
  useDepartments,
  useUpdateDepartment,
} from "@/hooks/api/useAdminDepartment";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Suspense, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paginator } from "@/components/Paginator";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { DepartmentsTabSkeleton, EmptyState } from "./AdminSettingsPageSkeleton";

export function AdminSettingsDepartmentTab() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<DepartmentsTabSkeleton />}>
        <DepartmentsTab />
      </Suspense>
    </QueryErrorBoundary>
  );
}

function DepartmentsTab() {
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<TDepartment | null>(null);
  const [formData, setFormData] = useState<TDepartmentCreateRequest>({
    name: "",
    code: "",
    isActive: false,
    description: "",
    headOfDepartment: "",
  });
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState("1");
  const {
    data: departments,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
    pagination,
  } = useDepartments({ limit, page });

  const handleCreate = () => {
    setEditingDepartment(null);
    setFormData({
      name: "",
      code: "",
      description: "",
      headOfDepartment: "",
      isActive: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (dept: TDepartment) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      isActive: dept.isActive || false,
      description: dept.description || "",
      headOfDepartment: dept.headOfDepartment || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingDepartment) {
        await updateDepartment.mutateAsync({
          id: editingDepartment.id,
          data: formData,
        });
        toast.success("Department updated successfully");
      } else {
        await createDepartment.mutateAsync(formData);
        toast.success("Department created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(
        `Failed to ${editingDepartment ? "update" : "create"} department`,
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteDepartment.mutateAsync(id);
      toast.success("Department deleted successfully");
    } catch {
      toast.error("Failed to delete department");
    }
  };

  if (isFetching) return <DepartmentsTabSkeleton />;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Units/Departments
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage organizational units and departments
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Department
        </Button>
      </div>

      {/* Content */}
      {departments.length === 0 ? (
        <Card className="stats-card p-8">
          <EmptyState
            title="No departments found"
            icon={Building2}
            onAction={handleCreate}
            actionLabel="Add Department"
            description="Get started by creating your first department"
          />
        </Card>
      ) : (
        <Card className="stats-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Staff Count
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {dept.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {dept.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {dept.staffCount}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          dept.isActive
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {dept.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(dept)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(dept.id, dept.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="py-2 px-4 border-t">
              <Paginator
                value={limit}
                currentPage={+page}
                isFetching={isFetching}
                fetchNextPage={() => {
                  fetchNextPage();
                  setPage(`${+page + 1}`);
                }}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                fetchPreviousPage={() => {
                  fetchPreviousPage();
                  setPage(`${+page - 1}`);
                }}
                hasPreviousPage={pagination.hasPrevPage}
                onRowsPerPageChange={(value) => setLimit(value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Edit Department" : "Add Department"}
            </DialogTitle>
            <DialogDescription>
              {editingDepartment
                ? "Update the department information"
                : "Create a new department"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., CS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the department"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hod">Head of Department (Optional)</Label>
              <Input
                id="hod"
                value={formData.headOfDepartment}
                placeholder="e.g., Prof. John Doe"
                onChange={(e) =>
                  setFormData({ ...formData, headOfDepartment: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                className="border w-5 h-5"
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <Label>Is Active </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={
                createDepartment.isPending || updateDepartment.isPending
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                !formData.code ||
                createDepartment.isPending ||
                updateDepartment.isPending
              }
            >
              {createDepartment.isPending || updateDepartment.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
