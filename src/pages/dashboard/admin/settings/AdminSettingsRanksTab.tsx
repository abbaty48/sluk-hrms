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
  useRanks,
  useCreateRank,
  useUpdateRank,
  useDeleteRank,
} from "@/hooks/api/useAdminSettingsAPI";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Medal } from "lucide-react";
import type { TRank, TCreateRankRequest } from "@/types/rankTypes";
import { ListTabSkeleton, EmptyState } from "./AdminSettingsPageSkeleton";

const CATEGORIES = ["Academic", "Non-Academic", "Administrative"] as const;

export function AdminSettingsRanksTab() {
  const { data, isLoading } = useRanks();
  const createRank = useCreateRank();
  const updateRank = useUpdateRank();
  const deleteRank = useDeleteRank();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<TRank | null>(null);
  const [formData, setFormData] = useState<TCreateRankRequest>({
    name: "",
    level: 1,
    salaryGrade: "",
    requirements: "",
    category: "Academic",
  });

  const handleCreate = () => {
    setEditingRank(null);
    setFormData({
      name: "",
      level: 1,
      salaryGrade: "",
      requirements: "",
      category: "Academic",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (rank: TRank) => {
    setEditingRank(rank);
    setFormData({
      name: rank.name,
      level: rank.level,
      category: rank.category,
      salaryGrade: rank.salaryGrade || "",
      requirements: rank.requirements || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingRank) {
        await updateRank.mutateAsync({
          id: editingRank.id,
          data: formData,
        });
        toast.success("Rank updated successfully");
      } else {
        await createRank.mutateAsync(formData);
        toast.success("Rank created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(`Failed to ${editingRank ? "update" : "create"} rank`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteRank.mutateAsync(id);
      toast.success("Rank deleted successfully");
    } catch {
      toast.error("Failed to delete rank");
    }
  };

  if (isLoading) return <ListTabSkeleton />;

  const ranks = data?.data || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Ranks</h2>
          <p className="text-sm text-muted-foreground">
            Manage staff ranks and levels
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Rank
        </Button>
      </div>

      {/* Content */}
      {ranks.length === 0 ? (
        <Card className="stats-card p-8">
          <EmptyState
            title="No ranks found"
            description="Get started by creating your first rank"
            icon={Medal}
            actionLabel="Add Rank"
            onAction={handleCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ranks.map((rank) => (
            <Card key={rank.id} className="stats-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{rank.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Level {rank.level} • {rank.category}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(rank)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(rank.id, rank.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {rank.salaryGrade && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground">Salary Grade</p>
                  <p className="text-sm font-medium">{rank.salaryGrade}</p>
                </div>
              )}

              {rank.requirements && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {rank.requirements}
                </p>
              )}

              <div className="mt-3">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    rank.isActive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {rank.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRank ? "Edit Rank" : "Add Rank"}</DialogTitle>
            <DialogDescription>
              {editingRank
                ? "Update the rank information"
                : "Create a new rank"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rank Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Professor"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  type="number"
                  min="1"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: (typeof CATEGORIES)[number]) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryGrade">Salary Grade (Optional)</Label>
              <Input
                id="salaryGrade"
                value={formData.salaryGrade}
                onChange={(e) =>
                  setFormData({ ...formData, salaryGrade: e.target.value })
                }
                placeholder="e.g., Grade 15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (Optional)</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                placeholder="e.g., PhD degree, 10 years experience"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={createRank.isPending || updateRank.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                !formData.level ||
                createRank.isPending ||
                updateRank.isPending
              }
            >
              {createRank.isPending || updateRank.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
