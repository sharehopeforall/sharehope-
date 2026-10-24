import { setRequestLocale } from "next-intl/server";
import FounderContent from "@/components/public/FounderContent";
import { getManagedMetadata, getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getManagedMetadata("founder", locale, "Our Founder | ShareHope");
}

export default async function FounderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const managed = await getManagedPage("founder", locale);

  return <FounderContent locale={locale} managed={managed} />;
}
