import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@sluk/src/components/ui/dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Label } from "@sluk/src/components/ui/label";
import { Input } from "@sluk/src/components/ui/input";
import { Button } from "@sluk/src/components/ui/button";
import { Textarea } from "@sluk/src/components/ui/textarea";
import type { ErrorResponseType } from "@sluk/src/types/errorResponseType";
import { useASSharedContext, type ASSharedEntity } from "./AdminSettingsStates";

const emptyStates = {
  id: "",
  name: "",
  title: "",
  status: "",
  isActive: "",
  description: "",
};

export function ASSharedDialog() {
  const {
    action,
    editEntity,
    openDialog,
    createHook,
    updateHook,
    resetStates,
    changeStates,
  } = useASSharedContext();
  const { mutateAsync: createEntity, isPending: isCreating } = createHook();
  const { mutateAsync: updateEntity, isPending: isUpdating } = updateHook();
  const [formData, setFormData] = useState<ASSharedEntity>(emptyStates);
  /** */
  useEffect(() => {
    (() => {
      setFormData(
        editEntity ?? {
          id: "",
          name: "",
          title: "",
          status: "",
          isActive: "",
          description: "",
        },
      );
    })();
    return () => {
      setFormData(emptyStates);
    };
  }, [editEntity]);
  /** */
  const handleSave = async () => {
    try {
      if (action === "edit" && editEntity) {
        await updateEntity({
          id: editEntity.id,
          data: formData,
        });
        toast.success("Entity updated");
      } else {
        await createEntity(formData);
        toast.success("Entity created");
      }
      resetStates();
    } catch (err: any) {
      const error = err as ErrorResponseType;
      toast.error(error.errorTitle, { description: error.errorMessage });
    }
  };
  /** */
  const changeForm = (state: Partial<ASSharedEntity>) => {
    setFormData((prev) => ({ ...prev, ...state }));
  };
  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => changeStates({ openDialog: open })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "edit" ? "Edit Entity" : "Add Entity"}
          </DialogTitle>
          <DialogDescription>
            {action === "edit"
              ? "Update the Entity information"
              : "Create a new Entity"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title/name">Title/Name</Label>
            <Input
              id="title/name"
              value={formData?.title || formData?.name || ""}
              onChange={(e) =>
                changeForm({ title: e.target.value, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => changeForm({ description: e.target.value })}
              placeholder="Detailed description of the Entity"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              changeStates({
                openDialog: false,
                editEntity: null,
                action: "create",
              })
            }
            disabled={isUpdating || isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !formData.title ||
              !formData.description ||
              isCreating ||
              isUpdating
            }
          >
            {isCreating || isUpdating ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
