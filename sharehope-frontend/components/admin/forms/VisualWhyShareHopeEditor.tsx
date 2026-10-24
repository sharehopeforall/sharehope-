"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ImagePlus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { WhyShareHopeItem } from "@/components/public/WhyShareHopeSection";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { markHomepageDirty, useHomepageSaveEvent } from "@/hooks/useHomepageSaveEvent";
import type { MergedHomepageSection } from "@/hooks/useHomepage";
import { websiteApi } from "@/lib/api/website";
import type { UpdateHomepageSectionInput } from "@/types/website";

type EditableLocale = "en" | "fr";
type LocalizedItems = Record<EditableLocale, WhyShareHopeItem[]>;

interface Props {
  section: MergedHomepageSection;
  onSave: (data: UpdateHomepageSectionInput) => void | Promise<void>;
  isSaving?: boolean;
  justSaved?: boolean;
  saveError?: boolean;
  locale: EditableLocale;
}

const DEFAULT_TEXT = {
  en: { eyebrow: "Why ShareHope?", title: "Because opportunity changes everything" },
  fr: { eyebrow: "Pourquoi ShareHope ?", title: "Parce que les opportunités changent tout" },
};

const DEFAULT_ITEMS: LocalizedItems = {
  en: [
    { label: "Education", description: "We expand access to learning, school supplies, and educational support so every child has the chance to thrive.", buttonText: "Explore Education", buttonUrl: "/programs", imageUrl: "/images/hero-placeholders/child-learning.png" },
    { label: "Health", description: "We connect children and families with essential healthcare and resources that support healthier lives.", buttonText: "Explore Health", buttonUrl: "/programs", imageUrl: "/images/hero-placeholders/child-smiling.png" },
    { label: "Community", description: "We work alongside local communities to create lasting opportunities and stronger support systems.", buttonText: "Explore Community", buttonUrl: "/impact", imageUrl: "/images/hero-placeholders/clean-water.png" },
  ],
  fr: [
    { label: "Éducation", description: "Nous élargissons l’accès à l’apprentissage, aux fournitures scolaires et au soutien éducatif afin que chaque enfant puisse s’épanouir.", buttonText: "Découvrir l’éducation", buttonUrl: "/programs", imageUrl: "/images/hero-placeholders/child-learning.png" },
    { label: "Santé", description: "Nous mettons les enfants et les familles en relation avec les soins et les ressources essentiels à une vie plus saine.", buttonText: "Découvrir la santé", buttonUrl: "/programs", imageUrl: "/images/hero-placeholders/child-smiling.png" },
    { label: "Communauté", description: "Nous travaillons avec les communautés locales pour créer des possibilités durables et des réseaux de soutien plus solides.", buttonText: "Découvrir la communauté", buttonUrl: "/impact", imageUrl: "/images/hero-placeholders/clean-water.png" },
  ],
};

function storedItems(section: MergedHomepageSection, locale: EditableLocale): WhyShareHopeItem[] {
  const raw = section.settings[locale === "en" ? "itemsEn" : "itemsFr"];
  if (Array.isArray(raw) && raw.every((item) => item && typeof item === "object")) {
    const items = (raw as WhyShareHopeItem[]).filter((item) => !/life skills|compétences de vie/i.test(item.label));
    if (items.length === 3) return items;
  }
  return DEFAULT_ITEMS[locale].map((item) => ({ ...item }));
}

export function VisualWhyShareHopeEditor({ section, onSave, isSaving, locale }: Props) {
  const t = useTranslations("HomepageEditor");
  const [enabled] = useState(section.enabled);
  const [eyebrow, setEyebrow] = useState({ en: section.en.subtitle ?? DEFAULT_TEXT.en.eyebrow, fr: section.fr.subtitle ?? DEFAULT_TEXT.fr.eyebrow });
  const [title, setTitle] = useState({ en: section.en.title ?? DEFAULT_TEXT.en.title, fr: section.fr.title ?? DEFAULT_TEXT.fr.title });
  const [items, setItems] = useState<LocalizedItems>({ en: storedItems(section, "en"), fr: storedItems(section, "fr") });
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStale, setTranslationStale] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const upload = useMediaUpload();
  const active = items[locale][activeIndex];

  const updateItem = (field: keyof WhyShareHopeItem, value: string) => {
    if (locale === "en") setTranslationStale(true);
    setItems((current) => ({ ...current, [locale]: current[locale].map((item, index) => index === activeIndex ? { ...item, [field]: value } : item) }));
  };

  const replaceImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const previous = active.imageUrl;
    const preview = URL.createObjectURL(file);
    updateItem("imageUrl", preview);
    setError(null);
    upload.mutate(file, {
      onSuccess: ({ url }) => { URL.revokeObjectURL(preview); updateItem("imageUrl", url); },
      onError: () => { URL.revokeObjectURL(preview); updateItem("imageUrl", previous); setError(t("uploadError")); },
    });
  };

  const save = async () => {
    setError(null);
    if (!title.en.trim() || !eyebrow.en.trim() || items.en.some((item) => !item.label.trim() || !item.description.trim() || !item.buttonText.trim())) {
      setError(t("requiredFields"));
      throw new Error("Impact section is incomplete.");
    }
    if (items.en.some((item) => !item.buttonUrl.startsWith("/") && !/^https?:\/\//i.test(item.buttonUrl))) {
      setError(t("invalidLink"));
      throw new Error("An impact link is invalid.");
    }
    let translated: Record<string, string> = {};
    const missing: Record<string, string> = {};
    if (translationStale || !eyebrow.fr.trim()) missing.subtitle = eyebrow.en;
    if (translationStale || !title.fr.trim()) missing.title = title.en;
    if (translationStale) {
      items.en.forEach((item, index) => {
        missing[`item${index}Label`] = item.label;
        missing[`item${index}Description`] = item.description;
        missing[`item${index}ButtonText`] = item.buttonText;
      });
    }
    if (Object.keys(missing).length) {
      setIsTranslating(true);
      try { translated = (await websiteApi.translateToFrench(missing)).fields; } catch { setError(t("translationWarning")); }
      setIsTranslating(false);
    }
    const translatedFrenchItems = translationStale
      ? items.fr.map((item, index) => ({
          ...item,
          label: translated[`item${index}Label`] || item.label,
          description: translated[`item${index}Description`] || item.description,
          buttonText: translated[`item${index}ButtonText`] || item.buttonText,
          imageUrl: items.en[index].imageUrl,
          buttonUrl: items.en[index].buttonUrl,
        }))
      : items.fr;
    if (translationStale && Object.keys(translated).length) {
      setEyebrow((current) => ({ ...current, fr: translated.subtitle || current.fr }));
      setTitle((current) => ({ ...current, fr: translated.title || current.fr }));
      setItems((current) => ({ ...current, fr: translatedFrenchItems }));
      setTranslationStale(false);
    }
    await onSave({
      enabled,
      displayOrder: section.displayOrder,
      settings: { ...section.settings, itemsEn: items.en, itemsFr: translatedFrenchItems },
      en: { subtitle: eyebrow.en, title: title.en, body: items.en[0].description, buttonText: items.en[0].buttonText },
      fr: { subtitle: translated.subtitle || eyebrow.fr || null, title: translated.title || title.fr || null, body: translatedFrenchItems[0].description, buttonText: translatedFrenchItems[0].buttonText },
    });
  };
  useHomepageSaveEvent(save);

  return (
    <section className={`relative bg-[#FBF6E8] px-5 py-12 md:px-8 md:py-16 ${enabled ? "" : "opacity-50"}`} onInputCapture={markHomepageDirty} onChangeCapture={markHomepageDirty}>
      <div className="absolute right-4 top-4 z-30 flex flex-wrap items-center gap-2 rounded-xl bg-white/95 p-2 shadow-sm backdrop-blur">
        {error && <span className="text-sm text-destructive">{error}</span>}
        {translationStale && <span className="text-sm text-amber-700">{t("translationStale")}</span>}
        {(isSaving || isTranslating || upload.isPending) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <div className="mx-auto max-w-[1120px]">
        <div className="mb-9 pt-8 text-center">
          <input aria-label={t("subheading")} value={eyebrow[locale]} onChange={(event) => { if (locale === "en") setTranslationStale(true); setEyebrow((current) => ({ ...current, [locale]: event.target.value })); }} className="mx-auto block w-full border-0 bg-transparent text-center text-[13px] font-bold uppercase tracking-[0.22em] text-[#557A4E] outline-none focus:ring-2 focus:ring-[#73A66D]/40" />
          <div className="mx-auto mt-4 h-0.5 w-16 bg-[#73A66D]" />
          <textarea aria-label={t("heading")} rows={2} value={title[locale]} onChange={(event) => { if (locale === "en") setTranslationStale(true); setTitle((current) => ({ ...current, [locale]: event.target.value })); }} className="mx-auto mt-5 block w-full max-w-[700px] resize-none border-0 bg-transparent text-center font-serif text-[36px] leading-[1.02] tracking-[-0.025em] text-[#132A52] outline-none focus:ring-2 focus:ring-[#73A66D]/40 md:text-[48px] lg:text-[56px]" />
        </div>

        <div className="relative min-h-[500px] overflow-hidden rounded-[20px] md:min-h-[540px]">
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={replaceImage} />
          <Image key={active.imageUrl} src={active.imageUrl} alt={active.label} fill sizes="(min-width: 1200px) 1120px, 100vw" className="object-cover" />
          <button type="button" onClick={() => fileInput.current?.click()} className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 font-semibold text-white opacity-0 transition hover:bg-black/35 hover:opacity-100 focus:bg-black/35 focus:opacity-100">{upload.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ImagePlus className="mr-2 h-5 w-5" />}{t("replacePhoto")}</button>
          <div className="absolute left-1/2 top-7 z-20 flex w-full -translate-x-1/2 flex-wrap justify-center gap-3 px-4">
            {items[locale].map((item, index) => (
              <button key={index} type="button" onClick={() => setActiveIndex(index)} className={`rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] shadow-sm ${activeIndex === index ? "bg-[#EAF2DF] text-[#47633D] ring-2 ring-white/70" : "bg-white text-[#1C2744]"}`}>{item.label}</button>
            ))}
          </div>
          <div className="absolute bottom-5 left-5 right-5 z-20 rounded-[16px] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] md:bottom-8 md:left-auto md:right-8 md:max-w-[420px] md:p-7">
            <input aria-label={t("category")} value={active.label} onChange={(event) => updateItem("label", event.target.value)} className="mb-3 w-full border-0 bg-transparent text-xs font-bold uppercase tracking-[0.14em] text-[#557A4E] outline-none focus:ring-2 focus:ring-[#73A66D]/40" />
            <textarea aria-label={t("description")} rows={5} value={active.description} onChange={(event) => updateItem("description", event.target.value)} className="w-full resize-none border-0 bg-transparent p-0 font-serif text-[17px] leading-[1.5] text-[#26334A] outline-none focus:ring-2 focus:ring-[#73A66D]/40 md:text-[18px]" />
            <div className="mt-6 inline-flex items-center gap-3 border-b border-[#6D965F] pb-1 text-[#496B3F]">
              <input aria-label={t("buttonText")} value={active.buttonText} onChange={(event) => updateItem("buttonText", event.target.value)} className="min-w-0 border-0 bg-transparent text-[13px] font-bold uppercase tracking-[0.12em] outline-none" /><ArrowRight size={17} />
            </div>
            <label className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#496B3F]"><span>{t("buttonLink")}</span><input aria-label={t("buttonLink")} value={active.buttonUrl} onChange={(event) => updateItem("buttonUrl", event.target.value)} className="min-w-0 flex-1 rounded border border-[#C8D8C2] bg-white px-2 py-1 text-[#26334A]" /></label>
          </div>
        </div>
      </div>
    </section>
  );
}
