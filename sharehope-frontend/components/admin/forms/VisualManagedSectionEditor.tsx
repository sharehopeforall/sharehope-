"use client";

import { useRef, useState } from "react";
import NeedIsRealSection from "@/components/public/NeedIsRealSection";
import NewsletterSection from "@/components/public/NewsletterSection";
import ProgramsPreviewSection from "@/components/public/ProgramsPreviewSection";
import type { MergedHomepageSection } from "@/hooks/useHomepage";
import type { UpdateHomepageSectionInput } from "@/types/website";
import { markHomepageDirty, useHomepageSaveEvent } from "@/hooks/useHomepageSaveEvent";
import { useMediaUpload } from "@/hooks/useMediaUpload";

type EditableLocale = "en" | "fr";
type ManagedKey = "need" | "programs" | "newsletter";
type Stat = { value: string; label: string };
type ActionLabels = string[];

interface Props {
  section: MergedHomepageSection;
  sectionKey: ManagedKey;
  locale: EditableLocale;
  onSave: (data: UpdateHomepageSectionInput) => void | Promise<void>;
  isSaving?: boolean;
  justSaved?: boolean;
  saveError?: boolean;
}

const LABELS: Record<ManagedKey, string> = {
  need: "The Need Is Real",
  programs: "Take Action",
  newsletter: "Newsletter",
};

const DEFAULTS: Record<ManagedKey, Record<EditableLocale, { eyebrow: string; title: string; body: string; buttonText: string }>> = {
  need: {
    en: { eyebrow: "The Need Is Real", title: "Millions of children and young adults still lack the opportunity to thrive.", body: "We support children, young adults, and families with education, food assistance, life skills, and essential resources, helping them build healthier, more independent futures.", buttonText: "Give Today" },
    fr: { eyebrow: "Le besoin est bien réel", title: "Des millions d'enfants et de jeunes adultes n'ont toujours pas la possibilité de s'épanouir.", body: "Nous soutenons les enfants, les jeunes adultes et les familles par l'éducation, l'aide alimentaire, les compétences de vie et les ressources essentielles, afin de les aider à bâtir un avenir plus sain et plus autonome.", buttonText: "Donnez aujourd'hui" },
  },
  programs: {
    en: { eyebrow: "Ready to Take Action?", title: "Choose how you want to make a difference.", body: "Explore the cards to find a meaningful way to support ShareHope.", buttonText: "" },
    fr: { eyebrow: "Prêt à passer à l'action ?", title: "Choisissez comment vous souhaitez faire une différence.", body: "Explorez les cartes pour trouver une façon significative de soutenir ShareHope.", buttonText: "" },
  },
  newsletter: {
    en: { eyebrow: "Stay Connected", title: "Get stories of hope\nin your inbox.", body: "Receive updates on our programs, upcoming events, and meaningful ways to support ShareHope.", buttonText: "Subscribe" },
    fr: { eyebrow: "Restons en contact", title: "Recevez des histoires d'espoir\ndans votre boîte de réception.", body: "Recevez des nouvelles de nos programmes, de nos événements et des façons significatives de soutenir ShareHope.", buttonText: "S'abonner" },
  },
};

const DEFAULT_STATS: Record<EditableLocale, Stat[]> = {
  en: [{ value: "1,200+", label: "People supported" }, { value: "5", label: "Programs" }, { value: "2", label: "Countries" }],
  fr: [{ value: "1 200+", label: "Personnes soutenues" }, { value: "5", label: "Programmes" }, { value: "2", label: "Pays" }],
};

const DEFAULT_ACTION_LABELS: Record<EditableLocale, ActionLabels> = {
  en: ["Make a Donation", "Support a Program", "Volunteer Your Skills", "Partner With ShareHope"],
  fr: ["Faire un don", "Soutenir un programme", "Offrir vos compétences", "Devenir partenaire"],
};

const LEGACY_ACTION_LABELS: Record<EditableLocale, ActionLabels> = {
  en: ["Give Monthly", "Sponsor a Program", "Start a Fundraiser", "Volunteer With Us"],
  fr: ["Don mensuel", "Parrainer un programme", "Lancer une collecte", "Devenir bénévole"],
};

const MONTHLY_ACTION_LABELS: Record<EditableLocale, ActionLabels> = {
  en: ["Make a Donation", "Become a Monthly Partner", "Volunteer Your Skills", "Partner With ShareHope"],
  fr: ["Faire un don", "Devenir partenaire mensuel", "Offrir vos compétences", "Devenir partenaire"],
};

function storedStats(section: MergedHomepageSection, locale: EditableLocale): Stat[] {
  const raw = section.settings[locale === "en" ? "statsEn" : "statsFr"];
  if (Array.isArray(raw) && raw.length === 3 && raw.every((item) => item && typeof item.value === "string" && typeof item.label === "string")) {
    return raw as Stat[];
  }
  return DEFAULT_STATS[locale].map((item) => ({ ...item }));
}

function storedActionLabels(section: MergedHomepageSection, locale: EditableLocale): ActionLabels {
  const raw = section.settings[locale === "en" ? "actionLabelsEn" : "actionLabelsFr"];
  if (Array.isArray(raw) && raw.length === 4 && raw.every((item) => typeof item === "string")) {
    if (
      raw.every((item, index) => item === LEGACY_ACTION_LABELS[locale][index]) ||
      raw.every((item, index) => item === MONTHLY_ACTION_LABELS[locale][index])
    ) {
      return [...DEFAULT_ACTION_LABELS[locale]];
    }
    return raw as string[];
  }
  return [...DEFAULT_ACTION_LABELS[locale]];
}

function storedActionImages(section: MergedHomepageSection): string[] {
  const raw = section.settings.actionImages;
  if (Array.isArray(raw) && raw.length === 4 && raw.every((item) => typeof item === "string")) {
    return raw as string[];
  }
  return ["", "", "", ""];
}

export function VisualManagedSectionEditor({
  section,
  sectionKey,
  locale,
  onSave,
}: Props) {
  const [enabled] = useState(section.enabled);
  const defaults = DEFAULTS[sectionKey];
  const [title, setTitle] = useState({ en: section.en.title ?? defaults.en.title, fr: section.fr.title ?? defaults.fr.title });
  const [eyebrow, setEyebrow] = useState({ en: section.en.subtitle ?? defaults.en.eyebrow, fr: section.fr.subtitle ?? defaults.fr.eyebrow });
  const [body, setBody] = useState({ en: section.en.body ?? defaults.en.body, fr: section.fr.body ?? defaults.fr.body });
  const [buttonText, setButtonText] = useState({ en: section.en.buttonText ?? defaults.en.buttonText, fr: section.fr.buttonText ?? defaults.fr.buttonText });
  const [stats, setStats] = useState<Record<EditableLocale, Stat[]>>({ en: storedStats(section, "en"), fr: storedStats(section, "fr") });
  const [actionLabels, setActionLabels] = useState<Record<EditableLocale, ActionLabels>>({
    en: storedActionLabels(section, "en"),
    fr: storedActionLabels(section, "fr"),
  });
  const [actionImages, setActionImages] = useState<string[]>(storedActionImages(section));
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const actionPhotoInput = useRef<HTMLInputElement>(null);
  const upload = useMediaUpload();
  const [ctaUrl, setCtaUrl] = useState(typeof section.settings.ctaUrl === "string" ? section.settings.ctaUrl : "/donate");
  const [, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    if (!title.en.trim() || !body.en.trim() || !eyebrow.en.trim()) {
      setError("Complete the English eyebrow, heading, and description.");
      throw new Error(`${LABELS[sectionKey]} is incomplete.`);
    }
    if (sectionKey === "need" && !ctaUrl.startsWith("/") && !/^https?:\/\//i.test(ctaUrl)) {
      setError("Use a site path such as /donate or a complete https:// link.");
      throw new Error("The Need Is Real link is invalid.");
    }
    await onSave({
      enabled,
      displayOrder: section.displayOrder,
      settings: {
        ...section.settings,
        ...(sectionKey === "need" ? { ctaUrl, statsEn: stats.en, statsFr: stats.fr } : {}),
        ...(sectionKey === "programs" ? { actionLabelsEn: actionLabels.en, actionLabelsFr: actionLabels.fr, actionImages } : {}),
      },
      en: { title: title.en || null, subtitle: eyebrow.en || null, body: body.en || null, buttonText: buttonText.en || null },
      fr: { title: title.fr || null, subtitle: eyebrow.fr || null, body: body.fr || null, buttonText: buttonText.fr || null },
    });
  };
  useHomepageSaveEvent(save);

  const content = {
    eyebrow: eyebrow[locale],
    title: title[locale],
    body: body[locale],
    buttonText: buttonText[locale],
    ctaUrl,
    stats: stats[locale],
    actionLabels: actionLabels[locale],
    actionImages,
  };

  const chooseActionPhoto = (index: number) => {
    setSelectedAction(index);
    actionPhotoInput.current?.click();
  };

  const replaceActionPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const index = selectedAction;
    event.target.value = "";
    if (!file || index === null) return;

    const previousUrl = actionImages[index];
    const previewUrl = URL.createObjectURL(file);
    setActionImages((current) => current.map((url, itemIndex) => itemIndex === index ? previewUrl : url));
    markHomepageDirty();

    upload.mutate(file, {
      onSuccess: (result) => {
        URL.revokeObjectURL(previewUrl);
        setActionImages((current) => current.map((url, itemIndex) => itemIndex === index ? result.url : url));
        setSelectedAction(null);
      },
      onError: () => {
        URL.revokeObjectURL(previewUrl);
        setActionImages((current) => current.map((url, itemIndex) => itemIndex === index ? previousUrl : url));
        setError("The photo could not be uploaded. Please try again.");
        setSelectedAction(null);
      },
    });
  };

  return (
    <section className={`relative overflow-hidden border-t-8 border-white ${enabled ? "" : "opacity-50"}`} onInputCapture={markHomepageDirty} onChangeCapture={markHomepageDirty}>
      {sectionKey === "need" && <div className="absolute right-4 top-4 z-30 rounded-xl bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur"><label className="flex min-w-[260px] items-center gap-2"><span className="font-medium">Button link</span><input value={ctaUrl} onChange={(event) => setCtaUrl(event.target.value)} className="min-w-0 flex-1 rounded-md border px-2 py-1" /></label></div>}
      {sectionKey === "programs" && (
        <input ref={actionPhotoInput} type="file" accept="image/*" className="hidden" onChange={replaceActionPhoto} />
      )}
      <div aria-label={`${LABELS[sectionKey]} inline editor`}>
        {sectionKey === "need" && <NeedIsRealSection locale={locale} content={content} editor={{ onChange: (field, value) => {
          if (field === "eyebrow") setEyebrow((current) => ({ ...current, [locale]: value }));
          if (field === "title") setTitle((current) => ({ ...current, [locale]: value }));
          if (field === "body") setBody((current) => ({ ...current, [locale]: value }));
          if (field === "buttonText") setButtonText((current) => ({ ...current, [locale]: value }));
        }, onStatChange: (index, field, value) => setStats((current) => ({ ...current, [locale]: current[locale].map((stat, statIndex) => statIndex === index ? { ...stat, [field]: value } : stat) })) }} />}
        {sectionKey === "programs" && <ProgramsPreviewSection locale={locale} content={content} editor={{ onChange: (field, value) => {
          if (field === "eyebrow") setEyebrow((current) => ({ ...current, [locale]: value }));
          if (field === "title") setTitle((current) => ({ ...current, [locale]: value }));
          if (field === "body") setBody((current) => ({ ...current, [locale]: value }));
        }, onActionLabelChange: (index, value) => setActionLabels((current) => ({
          ...current,
          [locale]: current[locale].map((label, labelIndex) => labelIndex === index ? value : label),
        })), onReplacePhoto: chooseActionPhoto }} />}
        {sectionKey === "newsletter" && <NewsletterSection locale={locale} content={content} editor={{ onChange: (field, value) => {
          if (field === "eyebrow") setEyebrow((current) => ({ ...current, [locale]: value }));
          if (field === "title") setTitle((current) => ({ ...current, [locale]: value }));
          if (field === "body") setBody((current) => ({ ...current, [locale]: value }));
          if (field === "buttonText") setButtonText((current) => ({ ...current, [locale]: value }));
        } }} />}
      </div>
    </section>
  );
}
