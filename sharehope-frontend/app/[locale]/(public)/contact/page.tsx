import type { Metadata } from "next";
import { Mail, MessageCircle, Users } from "lucide-react";
import PublicPageHeader from "@/components/public/PublicPageHeader";
import { getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "fr" ? "Nous contacter | ShareHope" : "Contact us | ShareHope", description: locale === "fr" ? "Communiquez avec l’équipe de ShareHope." : "Get in touch with the ShareHope team." };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const french = locale === "fr";
  const navigation = await getManagedPage("navigation-footer", locale);
  const email = typeof navigation?.settings.contactEmail === "string" ? navigation.settings.contactEmail : "";

  return (
    <>
      <PublicPageHeader title={french ? "Contactez-nous" : "Contact us"} subtitle={french ? "Nous sommes là pour vous aider à trouver la meilleure façon de participer." : "We’re here to help you find the right way to get involved."} />
      <section className="bg-[#FAF7F2] px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><Mail className="text-brand-green" aria-hidden="true" /><h2 className="mt-5 font-serif text-2xl font-bold text-brand-navy">{french ? "Questions générales" : "General questions"}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{french ? "Programmes, dons, événements ou toute autre question." : "Programs, giving, events, or anything else on your mind."}</p>{email ? <a href={`mailto:${email}`} className="mt-6 inline-flex break-all font-bold text-brand-green underline underline-offset-4">{email}</a> : <p className="mt-6 text-sm font-semibold text-amber-800">{french ? "Les coordonnées seront bientôt disponibles." : "Contact details will be available soon."}</p>}</article>
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><Users className="text-brand-orange" aria-hidden="true" /><h2 className="mt-5 font-serif text-2xl font-bold text-brand-navy">{french ? "Partenariats" : "Partnerships"}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{french ? "Parlez-nous de votre organisation et de l’impact que nous pourrions créer ensemble." : "Tell us about your organization and the impact we could create together."}</p>{email && <a href={`mailto:${email}?subject=${encodeURIComponent(french ? "Partenariat avec ShareHope" : "Partnering with ShareHope")}`} className="mt-6 inline-flex font-bold text-brand-green underline underline-offset-4">{french ? "Démarrer la conversation" : "Start a conversation"}</a>}</article>
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><MessageCircle className="text-[#D3A400]" aria-hidden="true" /><h2 className="mt-5 font-serif text-2xl font-bold text-brand-navy">{french ? "Délai de réponse" : "Response time"}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{french ? "Notre équipe répond habituellement dans un délai de deux jours ouvrables." : "Our team typically replies within two business days."}</p></article>
        </div>
      </section>
    </>
  );
}
