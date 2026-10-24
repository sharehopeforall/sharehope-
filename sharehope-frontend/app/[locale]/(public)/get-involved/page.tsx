import type { Metadata } from "next";
import { ArrowRight, HandHeart, Heart, Users } from "lucide-react";
import PublicPageHeader from "@/components/public/PublicPageHeader";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "fr" ? "S’impliquer | ShareHope" : "Get involved | ShareHope", description: locale === "fr" ? "Donnez, faites du bénévolat ou devenez partenaire de ShareHope." : "Donate, volunteer, or partner with ShareHope." };
}

export default async function GetInvolvedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const french = locale === "fr";
  const options = [
    { href: "/donate", icon: Heart, title: french ? "Faire un don" : "Make a donation", body: french ? "Soutenez directement les programmes menés par les communautés." : "Support community-led programs directly.", cta: french ? "Donner maintenant" : "Give today" },
    { href: "/volunteer", icon: HandHeart, title: french ? "Faire du bénévolat" : "Volunteer", body: french ? "Mettez votre temps et vos compétences au service d’un impact durable." : "Put your time and skills to work for lasting impact.", cta: french ? "Voir les possibilités" : "See opportunities" },
    { href: "/partner", icon: Users, title: french ? "Devenir partenaire" : "Become a partner", body: french ? "Créez avec nous des initiatives qui renforcent les communautés." : "Build initiatives with us that strengthen communities.", cta: french ? "Explorer les partenariats" : "Explore partnerships" },
  ] as const;

  return (
    <>
      <PublicPageHeader title={french ? "S’impliquer" : "Get involved"} subtitle={french ? "Chaque geste compte. Choisissez la façon qui vous ressemble." : "Every action matters. Choose the path that fits you."} />
      <section className="bg-[#FAF7F2] px-6 py-16 sm:py-20"><div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">{options.map(({ href, icon: Icon, title, body, cta }) => <article key={href} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF1BF] text-brand-navy"><Icon aria-hidden="true" /></span><h2 className="mt-6 font-serif text-3xl font-bold text-brand-navy">{title}</h2><p className="mt-4 flex-1 leading-7 text-slate-600">{body}</p><Link href={href} className="mt-8 inline-flex items-center gap-2 font-bold text-brand-green">{cta}<ArrowRight size={18} aria-hidden="true" /></Link></article>)}</div></section>
    </>
  );
}
