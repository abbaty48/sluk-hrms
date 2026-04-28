import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useAddDocument } from "@sluk/src/hooks/api/useEmployeeDocumentAPI";
import { mimes, type TUploadDocument } from "@sluk/src/types/documentTypes";
import type { ErrorResponseType } from "@sluk/src/types/errorResponseType";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@sluk/src/components/ui/alert";
import { Field, FieldLabel } from "@/components/ui/field";
import { LucideCheck, LucideX } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: any }>;
}

interface ImportState {
  open: boolean;
  progress: number;
  files: File[] | null;
  isUploading: boolean;
  importResult: ImportResult | null;
}

export function EmployeeDocumentUpload({
  isDialog,
  setDialog,
}: {
  isDialog: boolean;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    reset,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<TUploadDocument>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<ImportState>({
    files: null,
    open: false,
    progress: 0,
    isUploading: false,
    importResult: null,
  });

  const { mutateAsync: uploadDocument, isPending: isUploading } =
    useAddDocument();

  const onSubmit = async (data: TUploadDocument) => {
    clearErrors();

    if (!state.files) {
      toast.warning("Select a file before continueing.");
      return;
    } else {
      try {
        const formdata = new FormData();
        for (let x = 0; x < state.files.length; x++) {
          formdata.append("", state.files[x], state.files[x].name);
        }
        formdata.append("year", data.year ?? "");
        formdata.append("degree", data.degree ?? "");
        formdata.append("description", data.description);
        formdata.append("institution", data.institution ?? "");

        await uploadDocument(formdata, {
          onSuccess: () => {
            reset();
            setDialog(false);
            toast.success("Document uploaded.", {
              description: "Your document has been uploaded successfully.",
            });
          },
        });
      } catch (err: any) {
        const error = err as ErrorResponseType;
        console.error(error);
        toast.error(error.errorTitle, {
          description: error.errorMessage,
        });
      }
    }
  };

  const updateState = (updates: Partial<ImportState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const verifyUploadFile = (files: File[]) => {
    const selectedFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const selectedFile = files[i];
      if (!selectedFile) return;
      if (!Object.keys(mimes).includes(selectedFile.type)) {
        toast.warning("Invalid File", {
          description: `You have selected an unsupported file "${selectedFile.name}" and is ignored.`,
        });
        continue;
      } else {
        selectedFiles.push(selectedFile);
      }
    }
    return selectedFiles;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const __files = Array.from(files);
      if (state.files && state.files.length > 0) {
        updateState({
          files: verifyUploadFile([...Array.from(__files), ...state.files]),
        });
      } else {
        updateState({ files: verifyUploadFile(__files), importResult: null });
      }
    }
  };

  return (
    <Dialog open={isDialog}>
      {/* FIX — max height + flex col so footer is always visible */}
      <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0">
        {/* HEADER — fixed, never scrolls */}
        <CardHeader className="border-b shrink-0 px-6 pt-6 pb-4">
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>

        {/* BODY — scrollable */}
        <CardContent className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          <Alert>
            <AlertDescription className="">
              <span className="text-info-foreground">
                You can upload your certificate, images, identities, and office
                documents files.
              </span>
              <dd>
                <dt>Supported files:</dt>
                <dl>- Images include: png, jpeg, gif, and webp. </dl>
                <dl>- Portable Document Format PDF</dl>
                <dl>
                  - Office Documents include: word, excel, and powerpoint files.
                </dl>
              </dd>
            </AlertDescription>
          </Alert>
          <form
            id="upload-form"
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* FILE */}
            <Field className="space-y-1">
              <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  placeholder="Click to select"
                  disabled={state.isUploading}
                  accept={Object.keys(mimes).join(",")}
                  onChange={handleFileUpload}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </FieldLabel>
              <div className="bg-card rounded-md overflow-hidden overflow-y-auto">
                {state.files &&
                  state.files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm p-2 text-muted-foreground border-b"
                    >
                      <LucideCheck className="h-4 w-4 text-green-500" />
                      <span>{file.name}</span>
                      {!state.isUploading && (
                        <Button
                          type="button"
                          variant={"destructive"}
                          onClick={() => {
                            updateState({
                              files: state.files?.filter(
                                (f) => f.name != file.name,
                              ),
                            });
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="ml-auto hover:cursor-pointer hover:bg-warning-bg"
                        >
                          <LucideX className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            </Field>

            {/* DESCRIPTION */}
            <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
              Description (optional)
              <Textarea
                placeholder="Brief description of the document..."
                {...register("description", {
                  required: "Please describe the document you're uploading.",
                })}
              />
              {errors.description && (
                <p className="text-error">{errors.description.message}</p>
              )}
            </FieldLabel>

            {/* DEGREE + INSTITUTION */}
            <div className="grid grid-cols-2 gap-4">
              <FieldLabel className="flex flex-col items-start text-sm font-medium text-muted-foreground">
                Degree (optional)
                <Input
                  placeholder="e.g. B.Sc. Computer Science"
                  {...register("degree")}
                />
              </FieldLabel>
              <FieldLabel className="flex flex-col items-start text-sm font-medium text-muted-foreground">
                Institution (optional)
                <Input
                  placeholder="e.g. Bayero University"
                  {...register("institution")}
                />
              </FieldLabel>
            </div>

            {/* YEAR */}
            <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
              Year (optional)
              <Input
                type="number"
                placeholder="e.g. 2020"
                {...register("year")}
              />
            </FieldLabel>
          </form>
        </CardContent>

        {/* FOOTER — fixed at bottom, never scrolls */}
        <DialogFooter className="border-t shrink-0 px-6 py-4">
          <Button
            type="button"
            variant="destructive"
            disabled={isUploading}
            onClick={() => setDialog(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="upload-form" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
