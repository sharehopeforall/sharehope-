import type { Metadata } from "next";
import HealthContent from "@/components/public/HealthContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === "fr"
    ? { title: "Santé | ShareHope", description: "Découvrez comment ShareHope soutient les cliniques mobiles, l’eau potable et la nutrition." }
    : { title: "Health | ShareHope", description: "See how ShareHope brings mobile clinics, clean water, and nutrition support to communities without access to basic healthcare." };
}

export default async function HealthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HealthContent locale={locale} />;
}
