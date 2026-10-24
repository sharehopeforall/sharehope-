import { setRequestLocale } from "next-intl/server";
import OurStoryContent from "@/components/public/OurStoryContent";
import { getManagedMetadata, getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getManagedMetadata("our-story", locale, "Our Story | ShareHope");
}

export default async function OurStoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const managed = await getManagedPage("our-story", locale);

  return <OurStoryContent locale={locale} managed={managed} />;
}
