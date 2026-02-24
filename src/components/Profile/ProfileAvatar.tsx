import { Camera } from "lucide-react";
import { getInitials } from "@/lib/getInitails";

type Props = {
  name: string;
  image?: string | null;
  onUpload?: (file: File) => void;
};

export default function ProfileAvatar({ name, image, onUpload }: Props) {
  return (
    <div className="relative w-28 h-28">
      <div className="w-full h-full rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-white shadow">

        {image ? (
          <img src={image} className="w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}

      </div>

      {/* Upload Button */}
      <label className="absolute bottom-1 right-1 cursor-pointer bg-card border rounded-full p-2 shadow hover:scale-105 transition">
        <Camera size={16} />
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
