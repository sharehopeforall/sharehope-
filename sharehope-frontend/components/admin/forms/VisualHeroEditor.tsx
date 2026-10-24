"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Hero from "@/components/public/Hero";
import type { HeroContent } from "@/components/public/Hero";
import type { MergedHomepageSection } from "@/hooks/useHomepage";
import { markHomepageDirty, useHomepageSaveEvent } from "@/hooks/useHomepageSaveEvent";
import type { UpdateHomepageSectionInput } from "@/types/website";

type EditableLocale = "en" | "fr";

interface Props {
  section: MergedHomepageSection;
  locale: EditableLocale;
  onSave: (data: UpdateHomepageSectionInput) => void | Promise<void>;
  isSaving?: boolean;
}

export function VisualHeroEditor({ section, locale, onSave, isSaving }: Props) {
  const [enabled] = useState(section.enabled);
  const [kicker, setKicker] = useState({ en: section.en.subtitle ?? "FOR MILLIONS OF CHILDREN & FAMILIES", fr: section.fr.subtitle ?? "POUR DES MILLIONS D'ENFANTS ET DE FAMILLES" });
  const [headline, setHeadline] = useState({ en: section.en.title ?? "A Brighter Day", fr: section.fr.title ?? "Un jour meilleur" });
  const [description, setDescription] = useState({ en: section.en.body ?? "Your support creates opportunity and brighter futures.", fr: section.fr.body ?? "Votre soutien crée des opportunités et un avenir meilleur." });
  const [buttonText, setButtonText] = useState({ en: section.en.buttonText ?? "SUPPORT TODAY", fr: section.fr.buttonText ?? "SOUTENIR AUJOURD'HUI" });
  const [showSecureMessage] = useState(section.settings.showSecureMessage !== false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setError(null);
    if (!headline.en.trim() || !kicker.en.trim() || !description.en.trim() || !buttonText.en.trim()) {
      setError("Complete the English hero text and button label.");
      throw new Error("Hero section is incomplete.");
    }
    await onSave({
      enabled,
      displayOrder: section.displayOrder,
      settings: { ...section.settings, showSecureMessage },
      en: { title: headline.en, subtitle: kicker.en, body: description.en, buttonText: buttonText.en },
      fr: { title: headline.fr || null, subtitle: kicker.fr || null, body: description.fr || null, buttonText: buttonText.fr || null },
    });
  };
  useHomepageSaveEvent(save);

  const content: HeroContent = { kicker: kicker[locale], headline: headline[locale], description: description[locale], buttonText: buttonText[locale], showSecureMessage };

  return <section className={`relative border-t-8 border-white ${enabled ? "" : "opacity-50"}`} onInputCapture={markHomepageDirty} onChangeCapture={markHomepageDirty}>
    {(error || isSaving) && <div className="absolute right-4 top-4 z-40 flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
      {error && <span className="font-semibold text-destructive">{error}</span>}
      {isSaving && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
    </div>}
    <Hero locale={locale} content={content} editor={{
      onChange: (field, value) => {
        if (field === "kicker") setKicker((current) => ({ ...current, [locale]: value }));
        if (field === "headline") setHeadline((current) => ({ ...current, [locale]: value }));
        if (field === "description") setDescription((current) => ({ ...current, [locale]: value }));
        if (field === "buttonText") setButtonText((current) => ({ ...current, [locale]: value }));
      },
    }} />
  </section>;
}
