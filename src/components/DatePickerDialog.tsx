import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

type DatePickerDialogProps = {
  open: boolean;
  title: string;
  date: Date | undefined;
  onOpenChange: (open: boolean) => void;
  onDateChange: (date: Date | undefined) => void;
};

export function DatePickerDialog({
  open,
  date,
  title,
  onOpenChange,
  onDateChange,
}: DatePickerDialogProps) {
  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Select a date to filter requests.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
            formatters={{
              formatDay: (date) => date.toLocaleDateString("default", { day: "2-digit" }),
              formatYearDropdown: (date) => date.toLocaleDateString("default", { year: "numeric" }),
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
