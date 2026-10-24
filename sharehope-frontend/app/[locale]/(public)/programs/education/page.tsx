import type { Metadata } from "next";
import EducationWithOverrides from "@/components/public/EducationWithOverrides";
import type { EducationCopy, EducationPhotos } from "@/components/public/EducationContent";
import type { HomepageSectionResponse } from "@/types/website";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === "fr"
    ? { title: "Éducation | ShareHope", description: "Découvrez comment ShareHope favorise l’accès à l’école, aux ressources pédagogiques et au mentorat." }
    : { title: "Education | ShareHope", description: "See how ShareHope helps children access school, learning resources, mentorship, and brighter futures." };
}

export default async function EducationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let section: HomepageSectionResponse | undefined;

  try {
    const response = await fetchBackend(
      `${backendUrl}/api/public/website/homepage?locale=${encodeURIComponent(locale)}`,
      { cache: "no-store" },
    );
    if (response.ok) {
      const homepage = (await response.json()) as { sections: HomepageSectionResponse[] };
      section = homepage.sections.find((item) => item.key === "education" && item.enabled);
    }
  } catch {
    // Fall back to the built-in copy while the CMS API is offline.
  }

  const copyKey = locale === "fr" ? "copyFr" : "copyEn";
  const content = section?.settings[copyKey] as EducationCopy | undefined;
  const photos = section?.settings.photos as EducationPhotos | undefined;

  return <EducationWithOverrides locale={locale} content={content} photos={photos} />;
}
