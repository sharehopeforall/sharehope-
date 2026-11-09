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
    <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC] text-brand-navy">
      <div className="mx-auto max-w-[1280px] px-5 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.7fr_0.8fr_1fr] lg:gap-10">
          <div className="mx-auto max-w-[380px] text-center lg:mx-0 lg:text-left">
            <Link href="/" className="inline-flex rounded-xl border border-[#E2E8F0] bg-[#FFFEFA] px-4 py-2">
              <Image src="/logo-sharehope-blue.png" alt="ShareHope" width={270} height={75} className="h-14 w-auto object-contain sm:h-[68px]" />
            </Link>
            <p className="mt-5 max-w-[360px] text-[15px] leading-[1.7] text-brand-body sm:mt-6 sm:text-[16px]">
              {managed?.subtitle || (locale === "fr"
                ? "Aider les enfants, les jeunes adultes et les familles à bâtir un avenir plus sain et plus autonome."
                : "Helping children, young adults, and families build healthier, more independent futures.")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 border-y border-[#E2E8F0] py-8 sm:gap-10 lg:contents">
            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#111111] sm:text-[13px] sm:tracking-[0.18em]">{locale === "fr" ? "Explorer" : "Explore"}</h2>
              <ul className="mt-4 space-y-1 text-[15px] font-medium text-[#465568] lg:mt-5 lg:space-y-3.5">
                {exploreLinks.map((link) => <li key={link.href}><Link href={link.href} className="inline-block py-1.5 transition hover:text-[#13306B] hover:underline hover:underline-offset-4 lg:py-0">{link.label}</Link></li>)}
              </ul>
            </div>

            <div>
              <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#111111] sm:text-[13px] sm:tracking-[0.18em]">{t("getInvolved")}</h2>
              <ul className="mt-4 space-y-1 text-[15px] font-medium text-[#465568] lg:mt-5 lg:space-y-3.5">
                {actionLinks.map((link) => <li key={link.href}><Link href={link.href} className="inline-block py-1.5 transition hover:text-[#13306B] hover:underline hover:underline-offset-4 lg:py-0">{link.label}</Link></li>)}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 text-center lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-left">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#111111] sm:text-[13px] sm:tracking-[0.18em]">{managed?.title || (locale === "fr" ? "Passez à l'action" : "Take Action")}</h2>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#56606E] lg:mx-0 lg:mt-5">{managed?.body || (locale === "fr" ? "Votre soutien peut ouvrir la voie à un avenir meilleur." : "Your support can help open the door to a brighter future.")}</p>
            <Link href="/donate" className="type-button mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-6 py-4 text-white transition hover:-translate-y-0.5 hover:bg-brand-orange-hover lg:mt-6 lg:inline-flex lg:w-auto lg:py-3.5">
              {managed?.buttonText || (locale === "fr" ? "Donnez aujourd'hui" : "Give Today")}<ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href={contactEmail ? `mailto:${contactEmail}` : "/contact"} className="mt-4 inline-flex items-center justify-center gap-2 py-2 text-[14px] font-semibold text-[#465568] transition hover:text-[#13306B] lg:mt-5 lg:flex lg:justify-start lg:py-0">
              <Mail size={17} aria-hidden="true" />{t("contact")}
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center gap-4 border-t border-[#E2E8F0] pt-6 text-center text-[13px] text-[#708097] sm:mt-12 sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:gap-x-4">
            <p>© {year} ShareHope. {footer("rights")}</p>
            <Link href="/privacy" className="py-1 font-semibold text-[#465568] transition hover:text-[#13306B] hover:underline hover:underline-offset-4 sm:py-0">
              {locale === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
            </Link>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-[#E2E8F0] bg-white p-1 sm:border-0 sm:bg-transparent sm:p-0" aria-label={locale === "fr" ? "Choisir la langue" : "Choose language"}>
            <Link href={pathname} locale="en" className={`rounded-lg px-4 py-2.5 font-bold transition sm:px-3 sm:py-2 ${locale === "en" ? "bg-[#0B2746] text-white" : "hover:bg-[#F8FAFC] hover:text-[#0B2746]"}`}>EN</Link>
            <Link href={pathname} locale="fr" className={`rounded-lg px-4 py-2.5 font-bold transition sm:px-3 sm:py-2 ${locale === "fr" ? "bg-[#0B2746] text-white" : "hover:bg-[#F8FAFC] hover:text-[#0B2746]"}`}>FR</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
