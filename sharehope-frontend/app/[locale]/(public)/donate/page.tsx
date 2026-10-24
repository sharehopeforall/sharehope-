import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import DonateContent from "@/components/public/DonateContent";
import { getManagedMetadata, getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getManagedMetadata("donate", locale, "Donate | ShareHope");
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const managed = await getManagedPage("donate", locale);

  return (
    <Suspense>
      <DonateContent locale={locale} managed={managed} />
    </Suspense>
  );
}
