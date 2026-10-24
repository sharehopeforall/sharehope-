"use client";

import { useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import type { UploadMediaResult } from "@/types/media";

interface MediaUploaderProps {
  onUploaded: (result: UploadMediaResult) => void;
  accept?: string;
}

export function MediaUploader({ onUploaded, accept = "image/*" }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useMediaUpload();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    mutate(file, {
      onSuccess: onUploaded,
    });

    event.target.value = "";
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="mr-2 h-4 w-4" />
        )}
        Upload file
      </Button>
    </div>
  );
}
