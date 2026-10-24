"use client";

import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Button } from "@/components/ui/button";
import type { UploadMediaResult } from "@/types/media";

interface ImagePickerProps {
  value?: string;
  onChange: (result: UploadMediaResult | null) => void;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      {value ? (
        <div className="relative h-40 w-full max-w-sm overflow-hidden rounded-md border">
          <Image src={value} alt="" fill className="object-cover" />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={() => onChange(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex h-40 w-full max-w-sm items-center justify-center rounded-md border border-dashed text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}
      <MediaUploader onUploaded={onChange} />
    </div>
  );
}
