import { setRequestLocale } from "next-intl/server";
import AboutContent from "@/components/public/AboutContent";
import { getManagedMetadata, getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getManagedMetadata("about", locale, "About ShareHope");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const managed = await getManagedPage("about", locale);

  return <AboutContent locale={locale} managed={managed} />;
}
