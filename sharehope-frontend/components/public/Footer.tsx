"use client";

import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { ManagedPageContent } from "@/lib/server/site-page";

export function Footer({ managed }: { managed?: ManagedPageContent | null }) {
  const t = useTranslations("Nav");
  const footer = useTranslations("Footer");
  const locale = useLocale();
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const contactEmail = typeof managed?.settings.contactEmail === "string" ? managed.settings.contactEmail : "";

  const exploreLinks = [
    { href: "/about", label: t("aboutUs") },
    { href: "/about/our-story", label: t("ourStory") },
    { href: "/programs", label: t("programs") },
    { href: "/events", label: t("events") },
  ] as const;
  const actionLinks = [
    { href: "/donate", label: t("donate") },
    { href: "/volunteer", label: t("volunteer") },
    { href: "/partner", label: t("partnerWithUs") },
    { href: "/#newsletter", label: locale === "fr" ? "Infolettre" : "Newsletter" },
  ] as const;

  return (
    <footer className="border-t border-[#E5E0D8] bg-[#FFFEFB] text-brand-navy">
      <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-14 sm:pt-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.7fr_0.8fr_1fr] lg:gap-10">
          <div className="max-w-[380px]">
            <Link href="/" className="inline-flex rounded-xl border border-[#E5E0D8] bg-[#FFFEFA] px-4 py-2">
              <Image src="/logo-sharehope-blue.png" alt="ShareHope" width={270} height={75} className="h-[68px] w-auto object-contain" />
            </Link>
            <p className="mt-6 max-w-[360px] text-[16px] leading-[1.7] text-brand-body">
              {managed?.subtitle || (locale === "fr"
                ? "Aider les enfants, les jeunes adultes et les familles à bâtir un avenir plus sain et plus autonome."
                : "Helping children, young adults, and families build healthier, more independent futures.")}
            </p>
          </div>

          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#111111]">{locale === "fr" ? "Explorer" : "Explore"}</h2>
            <ul className="mt-5 space-y-3.5 text-[15px] font-medium text-[#465568]">
              {exploreLinks.map((link) => <li key={link.href}><Link href={link.href} className="transition hover:text-[#F05A24] hover:underline hover:underline-offset-4">{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#111111]">{t("getInvolved")}</h2>
            <ul className="mt-5 space-y-3.5 text-[15px] font-medium text-[#465568]">
              {actionLinks.map((link) => <li key={link.href}><Link href={link.href} className="transition hover:text-[#F05A24] hover:underline hover:underline-offset-4">{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#111111]">{managed?.title || (locale === "fr" ? "Passez à l'action" : "Take Action")}</h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[#56606E]">{managed?.body || (locale === "fr" ? "Votre soutien peut ouvrir la voie à un avenir meilleur." : "Your support can help open the door to a brighter future.")}</p>
            <Link href="/donate" className="type-button mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-orange px-6 py-3.5 text-white transition hover:-translate-y-0.5 hover:bg-brand-orange-hover">
              {managed?.buttonText || (locale === "fr" ? "Donnez aujourd'hui" : "Give Today")}<ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href={contactEmail ? `mailto:${contactEmail}` : "/contact"} className="mt-5 flex items-center gap-2 text-[14px] font-semibold text-[#465568] transition hover:text-[#F05A24]">
              <Mail size={17} aria-hidden="true" />{t("contact")}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-[#E5E0D8] pt-6 text-[13px] text-[#708097] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>© {year} ShareHope. {footer("rights")}</p>
            <Link href="/privacy" className="font-semibold text-[#465568] transition hover:text-[#F05A24] hover:underline hover:underline-offset-4">
              {locale === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
            </Link>
          </div>
          <div className="flex items-center gap-2" aria-label={locale === "fr" ? "Choisir la langue" : "Choose language"}>
            <Link href={pathname} locale="en" className={`rounded-lg px-3 py-2 font-bold transition ${locale === "en" ? "bg-[#0B2746] text-white" : "hover:bg-[#FAF7F2] hover:text-[#0B2746]"}`}>EN</Link>
            <Link href={pathname} locale="fr" className={`rounded-lg px-3 py-2 font-bold transition ${locale === "fr" ? "bg-[#0B2746] text-white" : "hover:bg-[#FAF7F2] hover:text-[#0B2746]"}`}>FR</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
