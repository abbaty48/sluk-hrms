import { Camera } from "lucide-react";
import { getInitials } from "@/lib/getInitials";

type Props = {
  name: string;
  image?: string | null;
  onUpload?: (file: File) => void;
};

export default function EmployeeProfileAvatar({ name, image, onUpload }: Props) {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0">
      <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold overflow-hidden border-4 border-white shadow">

        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}

      </div>

      {/* Upload Button */}
      <label className="absolute bottom-1 right-1 cursor-pointer bg-card border rounded-full p-1.5 sm:p-2 shadow hover:scale-105 transition">
        <Camera size={14} className="sm:hidden" />
        <Camera size={16} className="hidden sm:block" />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files?.[0]) return;
            onUpload?.(e.target.files[0]);
          }}
        />
      </label>
    </div>
  );
}