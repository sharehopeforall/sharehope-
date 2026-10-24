import type { Metadata } from "next";
import CommunityContent from "@/components/public/CommunityContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === "fr"
    ? { title: "Communauté | ShareHope", description: "Découvrez les programmes de mentorat, de formation professionnelle et de soutien aux familles de ShareHope." }
    : { title: "Community | ShareHope", description: "See how ShareHope builds lasting change through youth mentorship, vocational training, and family support programs." };
}

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <CommunityContent locale={locale} />;
}
