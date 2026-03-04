import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import type {
  TNatureOfAppointment,
  TCreateAppointmentRequest,
} from "@/types/appointmentTypes";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
} from "@/hooks/api/useAdminSettingsAPI";
import { toast } from "sonner";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ListTabSkeleton, EmptyState } from "./AdminSettingsPageSkeleton";
import { Plus, Edit, Trash2, FileText, Clock, Gift, X } from "lucide-react";

export function AdminSettingsAppointmentsTab() {
  const { data, isLoading } = useAppointments();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<TNatureOfAppointment | null>(null);
  const [formData, setFormData] = useState<TCreateAppointmentRequest>({
    name: "",
    description: "",
    duration: "",
    benefits: [],
  });
  const [benefitInput, setBenefitInput] = useState("");

  const handleCreate = () => {
    setEditingAppointment(null);
    setFormData({
      name: "",
      description: "",
      duration: "",
      benefits: [],
    });
    setBenefitInput("");
    setIsDialogOpen(true);
  };

  const handleEdit = (appointment: TNatureOfAppointment) => {
    setEditingAppointment(appointment);
    setFormData({
      name: appointment.name,
      description: appointment.description || "",
      duration: appointment.duration || "",
      benefits: appointment.benefits || [],
    });
    setBenefitInput("");
    setIsDialogOpen(true);
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({
        ...formData,
        benefits: [...(formData.benefits || []), benefitInput.trim()],
      });
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits?.filter((_, i) => i !== index) || [],
    });
  };

  const handleSave = async () => {
    try {
      if (editingAppointment) {
        await updateAppointment.mutateAsync({
          id: editingAppointment.id,
          data: formData,
        });
        toast.success("Appointment type updated successfully");
      } else {
        await createAppointment.mutateAsync(formData);
        toast.success("Appointment type created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(
        `Failed to ${editingAppointment ? "update" : "create"} appointment type`,
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteAppointment.mutateAsync(id);
      toast.success("Appointment type deleted successfully");
    } catch {
      toast.error("Failed to delete appointment type");
    }
  };

  if (isLoading) return <ListTabSkeleton />;

  const appointments = data?.data || [];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Nature of Appointments
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage employment appointment types and contracts
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" />
          Add Appointment Type
        </Button>
      </div>

      {/* Content */}
      {appointments.length === 0 ? (
        <Card className="stats-card p-8">
          <EmptyState
            title="No appointment types found"
            description="Get started by creating your first appointment type"
            icon={FileText}
            actionLabel="Add Appointment Type"
            onAction={handleCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="stats-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {appointment.name}
                  </h3>
                  {appointment.duration && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{appointment.duration}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(appointment)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDelete(appointment.id, appointment.name)
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {appointment.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {appointment.description}
                </p>
              )}

              {appointment.benefits && appointment.benefits.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Gift className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Benefits ({appointment.benefits.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {appointment.benefits.slice(0, 3).map((benefit, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {benefit.length > 20
                          ? `${benefit.substring(0, 20)}...`
                          : benefit}
                      </Badge>
                    ))}
                    {appointment.benefits.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{appointment.benefits.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.isActive
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {appointment.isActive ? "Active" : "Inactive"}
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
              {editingAppointment
                ? "Edit Appointment Type"
                : "Add Appointment Type"}
            </DialogTitle>
            <DialogDescription>
              {editingAppointment
                ? "Update the appointment type information"
                : "Create a new appointment type"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="space-y-2">
              <Label htmlFor="name">Appointment Type Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Permanent Full-Time"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., Permanent, 2 Years Contract, Temporary"
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
                placeholder="Detailed description of the appointment type"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Benefits (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  value={benefitInput}
                  placeholder="e.g., Health Insurance, Pension"
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddBenefit}
                  disabled={!benefitInput.trim()}
                >
                  Add
                </Button>
              </div>

              {formData.benefits && formData.benefits.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-muted/50 rounded-md">
                  {formData.benefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(index)}
                        className="ml-1 hover:bg-destructive/20 rounded-sm p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={
                createAppointment.isPending || updateAppointment.isPending
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                createAppointment.isPending ||
                updateAppointment.isPending
              }
            >
              {createAppointment.isPending || updateAppointment.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
