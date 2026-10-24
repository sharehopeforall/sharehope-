import Hero from "@/components/public/Hero";
import type { HeroContent } from "@/components/public/Hero";
import NeedIsRealSection from "@/components/public/NeedIsRealSection";
import MissionSection from "@/components/public/MissionSection";
import NewsletterSection from "@/components/public/NewsletterSection";
import ProgramsPreviewSection from "@/components/public/ProgramsPreviewSection";
import WhyShareHopeSection from "@/components/public/WhyShareHopeSection";
import type { WhyShareHopeItem } from "@/components/public/WhyShareHopeSection";
import type { HomepageSectionResponse } from "@/types/website";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let mission: HomepageSectionResponse | undefined;
  let hero: HomepageSectionResponse | undefined;
  let impact: HomepageSectionResponse | undefined;
  let need: HomepageSectionResponse | undefined;
  let programs: HomepageSectionResponse | undefined;
  let newsletter: HomepageSectionResponse | undefined;
  let cmsLoaded = false;

  try {
    const response = await fetchBackend(
      `${backendUrl}/api/public/website/homepage?locale=${encodeURIComponent(locale)}`,
      { cache: "no-store" },
    );
    if (response.ok) {
      cmsLoaded = true;
      const homepage = (await response.json()) as { sections: HomepageSectionResponse[] };
      hero = homepage.sections.find((section) => section.key === "hero" && section.enabled);
      mission = homepage.sections.find((section) => section.key === "mission" && section.enabled);
      impact = homepage.sections.find((section) => section.key === "impact" && section.enabled);
      need = homepage.sections.find((section) => section.key === "need" && section.enabled);
      programs = homepage.sections.find((section) => section.key === "programs" && section.enabled);
      newsletter = homepage.sections.find((section) => section.key === "newsletter" && section.enabled);
    }
  } catch {
    // Keep the built-in section copy available while the CMS API is offline.
  }

  return (
    <>
      {(hero || !cmsLoaded) && (
        <Hero
          locale={locale}
          content={hero ? {
            kicker: hero.subtitle,
            headline: hero.title,
            description: hero.body,
            buttonText: hero.buttonText,
            photoUrls: ["photo1Url", "photo2Url", "photo3Url", "photo4Url"].map((key) =>
              typeof hero.settings[key] === "string" ? hero.settings[key] as string : null,
            ),
            showSecureMessage: hero.settings.showSecureMessage !== false,
            photos: Array.isArray(hero.settings[locale === "fr" ? "photosFr" : "photosEn"])
              ? hero.settings[locale === "fr" ? "photosFr" : "photosEn"] as HeroContent["photos"]
              : null,
          } : undefined}
        />
      )}
      {(impact || !cmsLoaded) && (
        <WhyShareHopeSection
          content={
            impact
              ? {
                  eyebrow: impact.subtitle,
                  title: impact.title,
                  body: impact.body,
                  buttonText: impact.buttonText,
                  buttonUrl: typeof impact.settings.ctaUrl === "string" ? impact.settings.ctaUrl : null,
                  imageUrl: typeof impact.settings.imageUrl === "string" ? impact.settings.imageUrl : null,
                  categories:
                    Array.isArray(impact.settings[locale === "fr" ? "categoriesFr" : "categoriesEn"])
                      ? impact.settings[locale === "fr" ? "categoriesFr" : "categoriesEn"] as string[]
                      : null,
                  items:
                    Array.isArray(impact.settings[locale === "fr" ? "itemsFr" : "itemsEn"])
                      ? impact.settings[locale === "fr" ? "itemsFr" : "itemsEn"] as WhyShareHopeItem[]
                      : null,
                }
              : {
                  eyebrow: locale === "fr" ? "Pourquoi ShareHope ?" : "Why ShareHope?",
                  title: locale === "fr" ? "Parce que les opportunités changent tout" : undefined,
                  body: locale === "fr" ? "Chez ShareHope, nous aidons les personnes à accéder à l’éducation, aux soins de santé et aux compétences de vie afin qu’elles puissent bâtir un avenir meilleur et plus autonome pour elles-mêmes et leurs communautés." : undefined,
                  buttonText: locale === "fr" ? "Découvrir notre impact" : undefined,
                  categories: locale === "fr" ? ["Éducation", "Santé", "Compétences de vie", "Communauté"] : undefined,
                }
          }
        />
      )}
      {(mission || !cmsLoaded) && (
        <MissionSection
          content={
            mission
              ? {
                  title: mission.title,
                  body: mission.body,
                  buttonText: mission.buttonText,
                  ctaUrl: typeof mission.settings.ctaUrl === "string" ? mission.settings.ctaUrl : null,
                  imageUrl: typeof mission.settings.imageUrl === "string" ? mission.settings.imageUrl : null,
                  accentText: typeof mission.settings.accentText === "string" ? mission.settings.accentText : null,
                  eyebrow: locale === "fr" ? "Notre mission" : "Our Mission",
                }
              : {
                  eyebrow: locale === "fr" ? "Notre mission" : "Our Mission",
                }
          }
        />
      )}
      {(need || !cmsLoaded) && (
        <NeedIsRealSection
          locale={locale}
          content={need ? {
            eyebrow: need.subtitle,
            title: need.title,
            body: need.body,
            buttonText: need.buttonText,
            ctaUrl: typeof need.settings.ctaUrl === "string" ? need.settings.ctaUrl : null,
            stats: Array.isArray(need.settings[locale === "fr" ? "statsFr" : "statsEn"])
              ? need.settings[locale === "fr" ? "statsFr" : "statsEn"] as Array<{ value: string; label: string }>
              : null,
          } : undefined}
        />
      )}
      {(programs || !cmsLoaded) && (
        <ProgramsPreviewSection
          locale={locale}
          content={programs ? {
            eyebrow: programs.subtitle,
            title: programs.title,
            body: programs.body,
            actionLabels: Array.isArray(programs.settings[locale === "fr" ? "actionLabelsFr" : "actionLabelsEn"])
              ? programs.settings[locale === "fr" ? "actionLabelsFr" : "actionLabelsEn"] as string[]
              : null,
            actionImages: Array.isArray(programs.settings.actionImages)
              ? programs.settings.actionImages as string[]
              : null,
          } : undefined}
        />
      )}
      {(newsletter || !cmsLoaded) && (
        <NewsletterSection
          locale={locale}
          content={newsletter ? { eyebrow: newsletter.subtitle, title: newsletter.title, body: newsletter.body, buttonText: newsletter.buttonText } : undefined}
        />
      )}
    </>
  );
}
