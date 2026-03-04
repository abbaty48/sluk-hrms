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
  useCommittees,
  useCreateCommittee,
  useUpdateCommittee,
  useDeleteCommittee,
} from "@/hooks/api/useAdminSettingsAPI";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ListTabSkeleton, EmptyState } from "./AdminSettingsPageSkeleton";
import { Plus, Edit, Trash2, UsersRound, User, Calendar } from "lucide-react";

export function AdminSettingsCommitteesTab() {
  const { data, isLoading } = useCommittees();
  const createCommittee = useCreateCommittee();
  const updateCommittee = useUpdateCommittee();
  const deleteCommittee = useDeleteCommittee();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<TCommittee | null>(
    null,
  );
  const [formData, setFormData] = useState<TCreateCommitteeRequest>({
    name: "",
    members: [],
    chairman: "",
    purpose: "",
    description: "",
    meetingSchedule: "",
  });

  const handleCreate = () => {
    setEditingCommittee(null);
    setFormData({
      name: "",
      description: "",
      chairman: "",
      members: [],
      purpose: "",
      meetingSchedule: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (committee: TCommittee) => {
    setEditingCommittee(committee);
    setFormData({
      name: committee.name,
      members: committee.members || [],
      purpose: committee.purpose || "",
      chairman: committee.chairman || "",
      description: committee.description || "",
      meetingSchedule: committee.meetingSchedule || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingCommittee) {
        await updateCommittee.mutateAsync({
          id: editingCommittee.id,
          data: formData,
        });
        toast.success("Committee updated successfully");
      } else {
        await createCommittee.mutateAsync(formData);
        toast.success("Committee created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(
        `Failed to ${editingCommittee ? "update" : "create"} committee`,
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteCommittee.mutateAsync(id);
      toast.success("Committee deleted successfully");
    } catch {
      toast.error("Failed to delete committee");
    }
  };

  if (isLoading) return <ListTabSkeleton />;

  const committees = data?.data || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Committees</h2>
          <p className="text-sm text-muted-foreground">
            Manage organizational committees and working groups
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Committee
        </Button>
      </div>

      {/* Content */}
      {committees.length === 0 ? (
        <Card className="stats-card p-8">
          <EmptyState
            title="No committees found"
            description="Get started by creating your first committee"
            icon={UsersRound}
            actionLabel="Add Committee"
            onAction={handleCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {committees.map((committee) => (
            <Card key={committee.id} className="stats-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {committee.name}
                  </h3>
                  {committee.purpose && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {committee.purpose}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(committee)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(committee.id, committee.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {committee.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {committee.description}
                </p>
              )}

              <div className="space-y-2">
                {committee.chairman && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Chair:
                    </span>
                    <span className="text-xs font-medium">
                      {committee.chairman}
                    </span>
                  </div>
                )}

                {committee.members && committee.members.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <UsersRound className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Members:
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {committee.members.length}
                    </Badge>
                  </div>
                )}

                {committee.meetingSchedule && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {committee.meetingSchedule}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    committee.isActive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {committee.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
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

          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label htmlFor="name">Committee Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Academic Board Committee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                placeholder="e.g., Oversee academic policies and standards"
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
                placeholder="Detailed description of the committee's role and responsibilities"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chairman">Chairman (Optional)</Label>
                <Input
                  id="chairman"
                  value={formData.chairman}
                  onChange={(e) =>
                    setFormData({ ...formData, chairman: e.target.value })
                  }
                  placeholder="e.g., Prof. John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingSchedule">
                  Meeting Schedule (Optional)
                </Label>
                <Input
                  id="meetingSchedule"
                  value={formData.meetingSchedule}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meetingSchedule: e.target.value,
                    })
                  }
                  placeholder="e.g., Every Monday, 2 PM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="members">
                Members (Optional - Staff IDs, comma-separated)
              </Label>
              <Input
                id="members"
                value={formData.members?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    members: e.target.value
                      .split(",")
                      .map((id) => id.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="e.g., staff_1, staff_2, staff_3"
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
              disabled={createCommittee.isPending || updateCommittee.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                createCommittee.isPending ||
                updateCommittee.isPending
              }
            >
              {createCommittee.isPending || updateCommittee.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
