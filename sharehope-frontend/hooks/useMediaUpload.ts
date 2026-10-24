"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/lib/blob/upload";
import { deleteFile } from "@/lib/blob/delete";

export function useMediaUpload() {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
  });
}

export function useMediaDelete() {
  return useMutation({
    mutationFn: (url: string) => deleteFile(url),
  });
}
