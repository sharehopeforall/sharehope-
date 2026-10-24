import { setRequestLocale } from "next-intl/server";
import VolunteerContent from "@/components/public/VolunteerContent";
import { getManagedMetadata, getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getManagedMetadata("volunteer", locale, "Volunteer | ShareHope");
}

export default async function VolunteerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const managed = await getManagedPage("volunteer", locale);

  return <VolunteerContent locale={locale} managed={managed} />;
}
