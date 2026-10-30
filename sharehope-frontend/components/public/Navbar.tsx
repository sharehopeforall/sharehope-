"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type { ManagedPageContent } from "@/lib/server/site-page";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export default function Navbar({ managed }: { managed?: ManagedPageContent | null }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [getInvolvedOpen, setGetInvolvedOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Nav");
  const setting = (key: string, fallback: string) => typeof managed?.settings[key] === "string" && managed.settings[key] ? managed.settings[key] as string : fallback;

  const closeMenus = () => {
    setAboutOpen(false);
    setGetInvolvedOpen(false);
    setLanguageOpen(false);
    setMobileOpen(false);
  };

  const changeLanguage = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
    setLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8DFD1]/70 bg-[#FAF6ED]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1288px] items-center justify-between px-4 sm:px-8 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-sharehope-blue.png"
            alt="ShareHope"
            width={360}
            height={100}
            priority
            className="h-[58px] w-auto object-contain sm:h-[68px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="type-nav hidden items-center gap-8 text-[#1C2B36] lg:flex xl:gap-10">
          {/* About */}
          <div className="relative">
            <button
              onClick={() => {
                setAboutOpen(!aboutOpen);
                setGetInvolvedOpen(false);
                setLanguageOpen(false);
              }}
              aria-expanded={aboutOpen}
              className="flex items-center gap-1 transition hover:text-[#13306B]"
            >
              {setting("aboutLabel", t("about"))}
              <ChevronDown
                size={18}
                strokeWidth={2}
                className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`}
              />
            </button>

            {aboutOpen && (
              <div className="type-supporting absolute left-0 top-9 z-50 min-w-[190px] rounded-xl border border-slate-100 bg-white p-2 font-medium shadow-xl">
                <Link
                  href="/about"
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-3 hover:bg-slate-50"
                >
                  {t("aboutUs")}
                </Link>

                <Link
                  href="/about/our-story"
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-3 hover:bg-slate-50"
                >
                  {t("ourStory")}
                </Link>

                <Link
                  href="/about/founder"
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-3 hover:bg-slate-50"
                >
                  {t("founder")}
                </Link>
              </div>
            )}
          </div>

          <Link href="/programs" className="transition hover:text-[#13306B]">
            {setting("programsLabel", t("programs"))}
          </Link>

          <Link href="/events" className="transition hover:text-[#13306B]">
            {setting("eventsLabel", t("events"))}
          </Link>

          <Link href="/ministry" className="transition hover:text-[#13306B]">
            {t("ministry")}
          </Link>

          <Link href="/blog" className="transition hover:text-[#13306B]">
            {t("blog")}
          </Link>

          {/* Get Involved */}
          <div className="relative">
            <button
              onClick={() => {
                setGetInvolvedOpen(!getInvolvedOpen);
                setAboutOpen(false);
                setLanguageOpen(false);
              }}
              aria-expanded={getInvolvedOpen}
              className="flex items-center gap-1 transition hover:text-[#13306B]"
            >
              {setting("getInvolvedLabel", t("getInvolved"))}
              <ChevronDown
                size={18}
                strokeWidth={2}
                className={`transition-transform ${getInvolvedOpen ? "rotate-180" : ""}`}
              />
            </button>

            {getInvolvedOpen && (
              <div className="type-supporting absolute left-0 top-9 z-50 min-w-[200px] rounded-xl border border-slate-100 bg-white p-2 font-medium shadow-xl">
                <Link
                  href="/volunteer"
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-3 hover:bg-slate-50"
                >
                  {t("volunteer")}
                </Link>

                <Link
                  href="/partner"
                  onClick={closeMenus}
                  className="block rounded-lg px-4 py-3 hover:bg-slate-50"
                >
                  {t("partnerWithUs")}
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-7">
          {/* Divider */}
          <div className="hidden h-10 w-px bg-slate-200 lg:block" />

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => {
                setLanguageOpen(!languageOpen);
                setAboutOpen(false);
                setGetInvolvedOpen(false);
              }}
              aria-expanded={languageOpen}
              className="type-button flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-brand-navy shadow-sm transition hover:border-slate-300 sm:text-sm"
            >
              {locale.toUpperCase()}
              <ChevronDown
                size={18}
                className={`transition-transform ${languageOpen ? "rotate-180" : ""}`}
              />
            </button>

            {languageOpen && (
              <div className="type-supporting absolute right-0 top-14 z-50 w-[160px] rounded-xl border border-slate-100 bg-white p-2 font-medium shadow-xl">
                {routing.locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => changeLanguage(loc)}
                    className="block w-full rounded-lg px-4 py-3 text-left text-[#0B2D5C] hover:bg-slate-50"
                  >
                    {LOCALE_LABELS[loc]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Donate */}
          <Link
            href="/donate"
            className="type-button rounded-full bg-brand-orange px-5 py-2.5 text-xs text-white shadow-[0_4px_14px_rgba(240,90,36,0.26)] transition hover:-translate-y-0.5 hover:bg-brand-orange-hover hover:shadow-[0_6px_20px_rgba(240,90,36,0.34)] sm:text-sm lg:px-7 lg:py-3"
          >
            {setting("donateLabel", t("donate"))}
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen((open) => !open);
              setAboutOpen(false);
              setGetInvolvedOpen(false);
              setLanguageOpen(false);
            }}
            className="grid h-10 w-10 place-items-center rounded-xl text-brand-navy transition hover:bg-white/80 lg:hidden"
          >
            {mobileOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="absolute left-0 top-full w-full border-b border-slate-200 bg-white px-6 py-5 shadow-2xl lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-[1288px] flex-col text-sm font-semibold text-brand-navy">
            <Link href="/about" onClick={closeMenus} className="border-b border-slate-100 py-3">{setting("aboutLabel", t("about"))}</Link>
            <Link href="/programs" onClick={closeMenus} className="border-b border-slate-100 py-3">{setting("programsLabel", t("programs"))}</Link>
            <Link href="/events" onClick={closeMenus} className="border-b border-slate-100 py-3">{setting("eventsLabel", t("events"))}</Link>
            <Link href="/ministry" onClick={closeMenus} className="border-b border-slate-100 py-3">{t("ministry")}</Link>
            <Link href="/blog" onClick={closeMenus} className="border-b border-slate-100 py-3">{t("blog")}</Link>
            <Link href="/get-involved" onClick={closeMenus} className="border-b border-slate-100 py-3">{setting("getInvolvedLabel", t("getInvolved"))}</Link>
            <Link href="/donate" onClick={closeMenus} className="mt-5 rounded-full bg-brand-orange px-6 py-3 text-center font-bold text-white">{setting("donateLabel", t("donate"))}</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
