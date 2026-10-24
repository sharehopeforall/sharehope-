import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import MinistryContent from "@/components/public/MinistryContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: `${locale === "fr" ? "Ministère" : "Ministry"} | ShareHope` };
}

export default async function MinistryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MinistryContent locale={locale} />;
}
