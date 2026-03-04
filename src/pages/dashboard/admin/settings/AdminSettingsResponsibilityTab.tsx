import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  useResponsibilities,
  useCreateResponsibility,
  useUpdateResponsibility,
  useDeleteResponsibility,
} from "@/hooks/api/useAdminSettingsAPI";
import type {
  TResponsibility,
  TCreateResponsibilityRequest,
} from "@/types/responsibilityTypes";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ListTabSkeleton, EmptyState } from "./AdminSettingsPageSkeleton";

const PRIORITIES = ["low", "medium", "high"] as const;

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: CheckCircle2,
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    icon: AlertCircle,
  },
  high: {
    label: "High",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: AlertCircle,
  },
};

export function AdminSettingsResponsibilitiesTab() {
  const { data, isLoading } = useResponsibilities();
  const createResponsibility = useCreateResponsibility();
  const updateResponsibility = useUpdateResponsibility();
  const deleteResponsibility = useDeleteResponsibility();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResponsibility, setEditingResponsibility] =
    useState<TResponsibility | null>(null);
  const [formData, setFormData] = useState<TCreateResponsibilityRequest>({
    title: "",
    description: "",
    department: "",
    assignedTo: [],
    priority: "medium",
  });

  const handleCreate = () => {
    setEditingResponsibility(null);
    setFormData({
      title: "",
      description: "",
      department: "",
      assignedTo: [],
      priority: "medium",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (responsibility: TResponsibility) => {
    setEditingResponsibility(responsibility);
    setFormData({
      title: responsibility.title,
      description: responsibility.description,
      department: responsibility.department || "",
      assignedTo: responsibility.assignedTo || [],
      priority: responsibility.priority,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingResponsibility) {
        await updateResponsibility.mutateAsync({
          id: editingResponsibility.id,
          data: formData,
        });
        toast.success("Responsibility updated successfully");
      } else {
        await createResponsibility.mutateAsync(formData);
        toast.success("Responsibility created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(
        `Failed to ${editingResponsibility ? "update" : "create"} responsibility`,
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteResponsibility.mutateAsync(id);
      toast.success("Responsibility deleted successfully");
    } catch {
      toast.error("Failed to delete responsibility");
    }
  };

  if (isLoading) return <ListTabSkeleton />;

  const responsibilities = data?.data || [];

  // Group by priority
  const groupedResponsibilities = {
    high: responsibilities.filter((r) => r.priority === "high"),
    medium: responsibilities.filter((r) => r.priority === "medium"),
    low: responsibilities.filter((r) => r.priority === "low"),
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Responsibilities
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage staff responsibilities and duties
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Responsibility
        </Button>
      </div>

      {/* Content */}
      {responsibilities.length === 0 ? (
        <Card className="stats-card p-8">
          <EmptyState
            title="No responsibilities found"
            description="Get started by creating your first responsibility"
            icon={Shield}
            actionLabel="Add Responsibility"
            onAction={handleCreate}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {/* High Priority */}
          {groupedResponsibilities.high.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  High Priority
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {groupedResponsibilities.high.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedResponsibilities.high.map((resp) => (
                  <ResponsibilityCard
                    key={resp.id}
                    responsibility={resp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority */}
          {groupedResponsibilities.medium.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  Medium Priority
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {groupedResponsibilities.medium.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedResponsibilities.medium.map((resp) => (
                  <ResponsibilityCard
                    key={resp.id}
                    responsibility={resp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low Priority */}
          {groupedResponsibilities.low.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  Low Priority
                </h3>
                <Badge variant="secondary" className="ml-auto">
                  {groupedResponsibilities.low.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedResponsibilities.low.map((resp) => (
                  <ResponsibilityCard
                    key={resp.id}
                    responsibility={resp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingResponsibility
                ? "Edit Responsibility"
                : "Add Responsibility"}
            </DialogTitle>
            <DialogDescription>
              {editingResponsibility
                ? "Update the responsibility information"
                : "Create a new responsibility"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Course Coordination"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed description of the responsibility"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department (Optional)</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: (typeof PRIORITIES)[number]) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {PRIORITY_CONFIG[priority].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">
                Assigned To (Optional - Staff IDs, comma-separated)
              </Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedTo: e.target.value
                      .split(",")
                      .map((id) => id.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="e.g., staff_1, staff_2"
              />
              <p className="text-xs text-muted-foreground">
                Enter staff IDs separated by commas
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={
                createResponsibility.isPending || updateResponsibility.isPending
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.title ||
                !formData.description ||
                createResponsibility.isPending ||
                updateResponsibility.isPending
              }
            >
              {createResponsibility.isPending || updateResponsibility.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Responsibility Card Component
function ResponsibilityCard({
  onEdit,
  onDelete,
  responsibility,
}: {
  responsibility: TResponsibility;
  onEdit: (r: TResponsibility) => void;
  onDelete: (id: string, title: string) => void;
}) {
  const config = PRIORITY_CONFIG[responsibility.priority];

  return (
    <Card className="stats-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm text-foreground line-clamp-1">
          {responsibility.title}
        </h4>
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(responsibility)}
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(responsibility.id, responsibility.title)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {responsibility.description}
      </p>

      {responsibility.department && (
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {responsibility.department}
          </Badge>
        </div>
      )}

      {responsibility.assignedTo && responsibility.assignedTo.length > 0 && (
        <p className="text-xs text-muted-foreground mb-3">
          Assigned to {responsibility.assignedTo.length} staff member
          {responsibility.assignedTo.length > 1 ? "s" : ""}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Badge className={config.color}>{config.label}</Badge>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            responsibility.isActive
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {responsibility.isActive ? "Active" : "Inactive"}
        </span>
      </div>
    </Card>
  );
}
