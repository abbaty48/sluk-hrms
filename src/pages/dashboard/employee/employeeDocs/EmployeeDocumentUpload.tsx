import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { SelectFilter } from "@/components/SelectFilter"
import { useForm, Controller } from "react-hook-form"
import { SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAddDocument } from "@/hooks/api/useDocumentEmployee"
import { toast } from "sonner"

const CATEGORIES = [
  "Certificates",
  "Appointment Letters",
  "ID & Photos",
  "Other Documents",
]

type TUploadDocumentForm = {
  title:        string
  category:     string
  fileName:     string
  mimeType:     string
  fileSize?:    number
  description?: string
  degree?:      string
  institution?: string
  year?:        string
}

export function EmployeeDocumentsUpload({
  isDialog,
  setDialog,
}: {
  isDialog:  boolean
  setDialog: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const {
    reset,
    control,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<TUploadDocumentForm>()

  const { mutateAsync: uploadDocument, isPending: isUploading } = useAddDocument("staff_2")

  const onSubmit = async (data: TUploadDocumentForm) => {
    clearErrors()
    await uploadDocument(data, {
      onSuccess: () => {
        reset()
        setDialog(false)
        toast.success("Document uploaded.", {
          description: "Your document has been uploaded successfully.",
        })
      },
      onError: () => {
        toast.error("Upload failed.", {
          description: "Could not upload your document. Please try again.",
        })
      },
    })
  }

  return (
    <Dialog open={isDialog}>
      {/* FIX — max height + flex col so footer is always visible */}
      <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0">

        {/* HEADER — fixed, never scrolls */}
        <CardHeader className="border-b shrink-0 px-6 pt-6 pb-4">
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>

        {/* BODY — scrollable */}
        <CardContent className="overflow-y-auto flex-1 px-6 py-4">
          <form id="upload-form" className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            {/* TITLE */}
            <Field className="space-y-1">
              <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                Document Title
                <Input
                  placeholder="e.g. B.Sc Certificate"
                  {...register("title", { required: "Document title is required." })}
                />
                {errors.title && (
                  <FieldError className="text-xs">{errors.title.message}</FieldError>
                )}
              </FieldLabel>
            </Field>

            {/* CATEGORY */}
            <Field className="space-y-1">
              <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                Category
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required." }}
                  render={({ field }) => (
                    <SelectFilter
                      triggerClassName="w-full"
                      placeholder="Select Category"
                      onValueChange={field.onChange}
                    >
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectFilter>
                  )}
                />
                {errors.category && (
                  <FieldError className="text-xs">{errors.category.message}</FieldError>
                )}
              </FieldLabel>
            </Field>

            {/* FILE NAME */}
            <Field className="space-y-1">
              <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                File Name
                <Input
                  placeholder="e.g. bsc_certificate.pdf"
                  {...register("fileName", { required: "File name is required." })}
                />
                {errors.fileName && (
                  <FieldError className="text-xs">{errors.fileName.message}</FieldError>
                )}
              </FieldLabel>
            </Field>

            {/* MIME TYPE */}
            <Field className="space-y-1">
              <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
                File Type
                <Controller
                  name="mimeType"
                  control={control}
                  rules={{ required: "File type is required." }}
                  render={({ field }) => (
                    <SelectFilter
                      triggerClassName="w-full"
                      placeholder="Select File Type"
                      onValueChange={field.onChange}
                    >
                      <SelectItem value="application/pdf">PDF</SelectItem>
                      <SelectItem value="image/jpeg">JPG</SelectItem>
                      <SelectItem value="image/png">PNG</SelectItem>
                    </SelectFilter>
                  )}
                />
                {errors.mimeType && (
                  <FieldError className="text-xs">{errors.mimeType.message}</FieldError>
                )}
              </FieldLabel>
            </Field>

            {/* DESCRIPTION */}
            <FieldLabel className="flex flex-col items-start w-full text-sm font-medium text-muted-foreground">
              Description (optional)
              <Textarea
                placeholder="Brief description of the document..."
                {...register("description")}
              />
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
          <Button
            type="submit"
            form="upload-form"  
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}