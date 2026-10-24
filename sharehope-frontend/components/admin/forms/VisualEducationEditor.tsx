"use client";

import { useRef, useState } from "react";
import EducationContent, { educationDefaults, educationImages } from "@/components/public/EducationContent";
import type { EducationCopy, EducationPhotos } from "@/components/public/EducationContent";
import type { MergedHomepageSection } from "@/hooks/useHomepage";
import type { UpdateHomepageSectionInput } from "@/types/website";
import { markHomepageDirty, useHomepageSaveEvent } from "@/hooks/useHomepageSaveEvent";
import { useMediaUpload } from "@/hooks/useMediaUpload";

type EditableLocale = "en" | "fr";

interface Props {
  section: MergedHomepageSection;
  locale: EditableLocale;
  onSave: (data: UpdateHomepageSectionInput) => void | Promise<void>;
  isSaving?: boolean;
  justSaved?: boolean;
  saveError?: boolean;
}

function cloneCopy(source: typeof educationDefaults.en): EducationCopy {
  return JSON.parse(JSON.stringify(source)) as EducationCopy;
}

function storedCopy(section: MergedHomepageSection, locale: EditableLocale): EducationCopy {
  const raw = section.settings[locale === "en" ? "copyEn" : "copyFr"];
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const candidate = raw as Partial<EducationCopy>;
    const base = cloneCopy(locale === "en" ? educationDefaults.en : educationDefaults.fr);
    return { ...base, ...candidate } as EducationCopy;
  }
  return cloneCopy(locale === "en" ? educationDefaults.en : educationDefaults.fr);
}

function storedPhotos(section: MergedHomepageSection): EducationPhotos {
  const raw = section.settings.photos;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as EducationPhotos;
  }
  return {};
}

function setNestedField(copy: EducationCopy, key: string, value: string): EducationCopy {
  const parts = key.split(".");
  const next: EducationCopy = JSON.parse(JSON.stringify(copy));
  if (parts.length === 1) {
    (next as unknown as Record<string, unknown>)[parts[0]] = value;
    return next;
  }
  const [arrayKey, indexStr, field] = parts;
  const index = Number(indexStr);
  const arr = (next as unknown as Record<string, unknown>)[arrayKey];
  if (Array.isArray(arr) && arr[index] && field) {
    (arr[index] as Record<string, unknown>)[field] = value;
  }
  return next;
}

export function VisualEducationEditor({ section, locale, onSave }: Props) {
  const [enabled] = useState(section.enabled);
  const [copy, setCopy] = useState<Record<EditableLocale, EducationCopy>>({
    en: storedCopy(section, "en"),
    fr: storedCopy(section, "fr"),
  });
  const [photos, setPhotos] = useState<EducationPhotos>(storedPhotos(section));
  const copyRef = useRef(copy);
  const photosRef = useRef(photos);
  const pendingUploads = useRef<Set<Promise<void>>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<"hero" | "story" | "future" | number | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const upload = useMediaUpload();
  const [, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    markHomepageDirty();
    setCopy((current) => {
      const next = { ...current, [locale]: setNestedField(current[locale], key, value) };
      copyRef.current = next;
      return next;
    });
  };

  const choosePhoto = (target: "hero" | "story" | "future" | number) => {
    setSelectedPhoto(target);
    photoInput.current?.click();
  };

  const replacePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const target = selectedPhoto;
    event.target.value = "";
    if (!file || target === null) return;

    const previewUrl = URL.createObjectURL(file);
    applyPhoto(target, previewUrl);
    markHomepageDirty();

    const task = upload.mutateAsync(file).then(
      (result) => {
        URL.revokeObjectURL(previewUrl);
        applyPhoto(target, result.url);
        setSelectedPhoto(null);
      },
      () => {
        URL.revokeObjectURL(previewUrl);
        applyPhoto(target, previousUrl(target));
        setError("The photo could not be uploaded. Please try again.");
        setSelectedPhoto(null);
        throw new Error("The photo could not be uploaded.");
      },
    );
    pendingUploads.current.add(task);
    void task.finally(() => pendingUploads.current.delete(task)).catch(() => undefined);
  };

  const previousUrl = (target: "hero" | "story" | "future" | number): string => {
    if (typeof target === "number") return copy[locale].stories[target]?.image ?? "";
    return photos[target] ?? educationImages[target];
  };

  const applyPhoto = (target: "hero" | "story" | "future" | number, url: string) => {
    if (typeof target === "number") {
      setCopy((current) => {
        const next = { ...current, [locale]: setNestedField(current[locale], `stories.${target}.image`, url) };
        copyRef.current = next;
        return next;
      });
    } else {
      setPhotos((current) => {
        const next = { ...current, [target]: url };
        photosRef.current = next;
        return next;
      });
    }
  };

  const save = async () => {
    setError(null);
    await Promise.all([...pendingUploads.current]);
    const currentCopy = copyRef.current;
    const currentPhotos = photosRef.current;
    if (!currentCopy.en.cardTitle.trim() || !currentCopy.en.introTitle.trim()) {
      setError("Complete the English card title and intro heading.");
      throw new Error("Education page is incomplete.");
    }
    await onSave({
      enabled,
      displayOrder: section.displayOrder,
      settings: { ...section.settings, copyEn: currentCopy.en, copyFr: currentCopy.fr, photos: currentPhotos },
      en: {
        title: currentCopy.en.introTitle || null,
        subtitle: currentCopy.en.cardEyebrow || null,
        body: currentCopy.en.cardBody || null,
        buttonText: currentCopy.en.cardCta || null,
      },
      fr: {
        title: currentCopy.fr.introTitle || null,
        subtitle: currentCopy.fr.cardEyebrow || null,
        body: currentCopy.fr.cardBody || null,
        buttonText: currentCopy.fr.cardCta || null,
      },
    });
  };
  useHomepageSaveEvent(save);

  return (
    <section className={`relative overflow-hidden border-t-8 border-white ${enabled ? "" : "opacity-50"}`} onInputCapture={markHomepageDirty} onChangeCapture={markHomepageDirty}>
      <input ref={photoInput} type="file" accept="image/*" className="hidden" onChange={replacePhoto} />
      <div aria-label="Education page inline editor">
        <EducationContent
          locale={locale}
          content={copy[locale]}
          photos={photos}
          editor={{ onChange: handleChange, onReplacePhoto: choosePhoto }}
        />
      </div>
    </section>
  );
}
