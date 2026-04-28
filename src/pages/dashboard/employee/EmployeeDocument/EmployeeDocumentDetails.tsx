import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@sluk/src/components/ui/collapsible";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@sluk/src/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@sluk/src/lib/utils";
import type { TDocument } from "@sluk/src/types/documentTypes";

export function EmployeeDocumentDetails({
  details,
  handleClose,
}: {
  details: TDocument;
  handleClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <Card className="relative w-full max-w-md shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleClose}
          className="absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </Button>

        <CardHeader className="border-b shrink-0">
          {details ? (
            <>
              <CardTitle className="text-base">{details.fileName}</CardTitle>
              {details.staff && (
                <p className="text-xs text-muted-foreground">
                  {[details.staff.firstName, details.staff.lastName].join(" ")}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="shimmer h-5 w-40 rounded-md" />
              <div className="shimmer h-3 w-24 rounded-md mt-1" />
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-2 overflow-y-auto">
          {!details ? (
            // loading state while fetching doc detail
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="shimmer h-3 w-20 rounded-md" />
                <div className="shimmer h-3 w-28 rounded-md" />
              </div>
            ))
          ) : (
            <>
              {/*File Details*/}
              <dd className="border-b py-2">
                {[
                  { label: "Category", value: details.category },
                  { label: "File Type", value: details.mimeType },
                  { label: "File Size", value: details.fileSize },
                  {
                    label: "Uploaded",
                    value: formatDate(new Date(details.createdAt)),
                  },
                  { label: "Degree", value: details.degree },
                  { label: "Institution", value: details.institution },
                  { label: "Year", value: details.year },
                ]
                  .filter((row) => !!row.value)
                  .map((row) => (
                    <dl
                      key={row.label}
                      className="flex justify-between text-sm leading-loose"
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="text-right max-w-prose text-wrap text-ellipsis">
                        {row.value}
                      </span>
                    </dl>
                  ))}
              </dd>
              {/**/}
              <dd className="border-b py-2">
                {[
                  { label: "Year", value: details.year },
                  { label: "Degree", value: details.degree },
                  { label: "Institution", value: details.institution },
                ].map((row) => (
                  <dl
                    key={row.label}
                    className="flex justify-between text-sm leading-relaxed"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="text-right max-w-[60%]">
                      {row.value || "N/A"}
                    </span>
                  </dl>
                ))}
              </dd>
              {/*Description*/}
              <dd>
                <Collapsible>
                  <CollapsibleTrigger className="w-full text-left hover:bg-background/25 hover:cursor-pointer">
                    <dt className="flex justify-between pr-3 text-sm text-muted-foreground my-1 py-2 border-b w-full">
                      <span>Description</span>
                      <span>...</span>
                    </dt>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-b py-2">
                    <p>{details.description}</p>
                  </CollapsibleContent>
                </Collapsible>
              </dd>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    details.status === "Verified"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {details.status}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
