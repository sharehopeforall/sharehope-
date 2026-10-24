"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import MissionSection from "@/components/public/MissionSection";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { markHomepageDirty, useHomepageSaveEvent } from "@/hooks/useHomepageSaveEvent";
import type { MergedHomepageSection } from "@/hooks/useHomepage";
import { websiteApi } from "@/lib/api/website";
import type { UpdateHomepageSectionInput } from "@/types/website";

type EditableLocale = "en" | "fr";

interface Props {
  section: MergedHomepageSection;
  onSave: (data: UpdateHomepageSectionInput) => void | Promise<void>;
  isSaving?: boolean;
  justSaved?: boolean;
  saveError?: boolean;
  locale: EditableLocale;
}

const DEFAULT_TITLE = "Creating opportunities. Building brighter futures.";
const DEFAULT_BODY = "ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives.";
const DEFAULT_BUTTON = "Learn More About Us";
const DEFAULT_IMAGE = "/images/hero-placeholders/children-school.png";

function setting(section: MergedHomepageSection, key: string, fallback: string) {
  return typeof section.settings[key] === "string" ? section.settings[key] : fallback;
}

export function VisualMissionEditor({ section, onSave, isSaving, locale }: Props) {
  const t = useTranslations("HomepageEditor");
  const [enabled] = useState(section.enabled);
  const [title, setTitle] = useState({ en: section.en.title ?? DEFAULT_TITLE, fr: section.fr.title ?? "" });
  const [body, setBody] = useState({ en: section.en.body ?? DEFAULT_BODY, fr: section.fr.body ?? "" });
  const [buttonText, setButtonText] = useState({ en: section.en.buttonText ?? DEFAULT_BUTTON, fr: section.fr.buttonText ?? "" });
  const [imageUrl, setImageUrl] = useState(setting(section, "imageUrl", DEFAULT_IMAGE));
  const [ctaUrl, setCtaUrl] = useState(setting(section, "ctaUrl", "/about"));
  const [accentText, setAccentText] = useState(setting(section, "accentText", "Hope Empowers Communities"));
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationStale, setTranslationStale] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const upload = useMediaUpload();

  const replaceImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const previous = imageUrl;
    const preview = URL.createObjectURL(file);
    setImageUrl(preview);
    setError(null);
    upload.mutate(file, {
      onSuccess: (result) => {
        URL.revokeObjectURL(preview);
        setImageUrl(result.url);
      },
      onError: () => {
        URL.revokeObjectURL(preview);
        setImageUrl(previous);
        setError(t("uploadError"));
      },
    });
  };

  const save = async () => {
    setError(null);
    if (!title.en.trim() || !body.en.trim() || !buttonText.en.trim()) {
      setError(t("requiredFields"));
      throw new Error("Mission section is incomplete.");
    }
    if (!ctaUrl.startsWith("/") && !/^https?:\/\//i.test(ctaUrl)) {
      setError(t("invalidLink"));
      throw new Error("Mission link is invalid.");
    }
    const missing: Record<string, string> = {};
    if (!title.fr.trim() && title.en.trim()) missing.title = title.en;
    if (!body.fr.trim() && body.en.trim()) missing.body = body.en;
    if (!buttonText.fr.trim() && buttonText.en.trim()) missing.buttonText = buttonText.en;

    let translated: Record<string, string> = {};
    if (Object.keys(missing).length) {
      setIsTranslating(true);
      try {
        translated = (await websiteApi.translateToFrench(missing)).fields;
        setTitle((value) => ({ ...value, fr: value.fr || translated.title || "" }));
        setBody((value) => ({ ...value, fr: value.fr || translated.body || "" }));
        setButtonText((value) => ({ ...value, fr: value.fr || translated.buttonText || "" }));
      } catch {
        setError(t("translationWarning"));
      }
      setIsTranslating(false);
    }

    await onSave({
      enabled,
      displayOrder: section.displayOrder,
      settings: { ...section.settings, ctaUrl, imageUrl, accentText },
      en: { title: title.en, body: body.en, buttonText: buttonText.en },
      fr: {
        title: title.fr || translated.title || null,
        body: body.fr || translated.body || null,
        buttonText: buttonText.fr || translated.buttonText || null,
      },
    });
  };
  useHomepageSaveEvent(save);

  return (
    <section className={`relative ${enabled ? "" : "opacity-50"}`} onInputCapture={markHomepageDirty} onChangeCapture={markHomepageDirty}>
      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={replaceImage} />
      <div className="absolute left-4 top-4 z-30 flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 rounded-xl bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
        <label className="ml-auto flex min-w-[240px] items-center gap-2"><span className="font-medium">{t("buttonLink")}</span><input value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} className="min-w-0 flex-1 rounded-md border px-2 py-1" /></label>
        <label className="flex min-w-[260px] items-center gap-2"><span className="font-medium">Accent</span><input value={accentText} onChange={(event) => setAccentText(event.target.value)} className="min-w-0 flex-1 rounded-md border px-2 py-1" /></label>
      </div>
      <div className="absolute right-4 top-4 z-20 flex flex-wrap items-center gap-2 rounded-xl bg-white/95 p-2 shadow-sm backdrop-blur">
        {error && <span className="text-sm text-destructive">{error}</span>}
        {translationStale && <span className="text-sm text-amber-700">{t("translationStale")}</span>}
        {(isSaving || isTranslating || upload.isPending) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
      <MissionSection
        content={{ title: title[locale], body: body[locale], buttonText: buttonText[locale], ctaUrl, imageUrl, accentText, eyebrow: locale === "fr" ? "Notre mission" : "Our Mission" }}
        editor={{
          onChange: (field, value) => {
            if (field === "title") { if (locale === "en" && title.fr.trim()) setTranslationStale(true); setTitle((current) => ({ ...current, [locale]: value })); }
            if (field === "body") { if (locale === "en" && body.fr.trim()) setTranslationStale(true); setBody((current) => ({ ...current, [locale]: value })); }
            if (field === "buttonText") { if (locale === "en" && buttonText.fr.trim()) setTranslationStale(true); setButtonText((current) => ({ ...current, [locale]: value })); }
          },
          onReplaceImage: () => fileInput.current?.click(),
          isUploading: upload.isPending,
          replacePhotoLabel: t("replacePhoto"),
        }}
      />
    </section>
  );
}
