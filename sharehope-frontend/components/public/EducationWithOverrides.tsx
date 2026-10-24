"use client";

import { useEffect, useState } from "react";
import EducationContent from "@/components/public/EducationContent";
import type { EducationCopy, EducationPhotos } from "@/components/public/EducationContent";

const EDUCATION_CACHE_KEY = "sharehope:education-content";

interface StoredEducation {
  copyEn?: EducationCopy;
  copyFr?: EducationCopy;
  photos?: EducationPhotos;
}

interface Props {
  locale: string;
  content?: EducationCopy;
  photos?: EducationPhotos;
}

export default function EducationWithOverrides({ locale, content, photos }: Props) {
  const [stored, setStored] = useState<StoredEducation | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadStoredPreview = () => {
      if (cancelled) return;
      try {
        const raw = localStorage.getItem(EDUCATION_CACHE_KEY);
        if (raw) setStored(JSON.parse(raw) as StoredEducation);
      } catch {
        // Ignore malformed or unavailable storage.
      }
    };
    const frame = requestAnimationFrame(loadStoredPreview);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  const resolvedContent =
    (locale === "fr" ? stored?.copyFr : stored?.copyEn) ?? content;
  const resolvedPhotos = stored?.photos ?? photos;

  return (
    <EducationContent
      locale={locale}
      content={resolvedContent}
      photos={resolvedPhotos}
    />
  );
}
