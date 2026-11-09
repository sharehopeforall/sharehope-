"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, GraduationCap, HeartPulse, Users, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface WhyShareHopeItem {
  label: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
}

export interface WhyShareHopeContent {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  imageUrl?: string | null;
  categories?: string[] | null;
  items?: WhyShareHopeItem[] | null;
}

const DEFAULT_ITEMS: WhyShareHopeItem[] = [
  { label: "Education", description: "We expand access to learning, school supplies, and educational support so every child has the chance to thrive.", buttonText: "Explore Education", buttonUrl: "/education", imageUrl: "/images/hero-placeholders/child-learning.png" },
  { label: "Health", description: "We connect children and families with essential healthcare and resources that support healthier lives.", buttonText: "Explore Health", buttonUrl: "/health", imageUrl: "/images/hero-placeholders/child-smiling.png" },
  { label: "Community", description: "We work alongside local communities to create lasting opportunities and stronger support systems.", buttonText: "Explore Community", buttonUrl: "/community", imageUrl: "/images/hero-placeholders/clean-water.png" },
];

function iconFor(label: string): LucideIcon | null {
  if (/educ|éduc/i.test(label)) return GraduationCap;
  if (/health|santé/i.test(label)) return HeartPulse;
  if (/community|communaut/i.test(label)) return Users;
  return null;
}

const pad = (value: number) => String(value).padStart(2, "0");

const REMOVED_LEGACY_EYEBROW = "ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives";

export default function WhyShareHopeSection({ content = {} }: { content?: WhyShareHopeContent }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const title = content.title ?? "Because opportunity changes everything";
  const titleBreak = title.match(/^(.+?)(\s+changes\s+.+)$/i);
  const legacyItems = content.categories?.filter((label) => !/life skills|compétences de vie/i.test(label)).map((label) => ({
    label,
    description: content.body ?? DEFAULT_ITEMS[0].description,
    buttonText: content.buttonText ?? "Learn About Our Impact",
    buttonUrl: content.buttonUrl ?? "/impact",
    imageUrl: content.imageUrl ?? DEFAULT_ITEMS[0].imageUrl,
  }));
  const savedItems = content.items?.filter((item) => !/life skills|compétences de vie/i.test(item.label));
  const items = savedItems?.length ? savedItems : legacyItems?.length ? legacyItems : DEFAULT_ITEMS;
  const active = items[Math.min(activeIndex, items.length - 1)];
  const eyebrow = content.eyebrow?.replace(/[.\s]+$/, "") === REMOVED_LEGACY_EYEBROW
    ? "Why ShareHope?"
    : content.eyebrow ?? "Why ShareHope?";

  return (
    <section id="why-sharehope" className="scroll-mt-20 border-t border-[#E5E0D8] bg-[#FAF7F2] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-3 text-center">
          <p data-visual-key="why-sharehope-eyebrow" className="font-mono-spaced text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">{eyebrow}</p>
          <h2 className="mx-auto max-w-[760px] text-balance font-serif text-3xl tracking-tight text-[#121212] sm:text-5xl">
            {titleBreak ? <>{titleBreak[1]}<br />{titleBreak[2].trim()}</> : title}
          </h2>
        </div>

        <div className="relative mx-auto max-w-6xl md:rounded-sm md:border md:border-[#E5E0D8] md:bg-white md:p-6 md:shadow-xl lg:p-8">
          <div className="absolute -top-3 left-1/2 z-20 hidden h-6 w-28 -translate-x-1/2 border-x border-dashed border-[#B4AA96]/40 bg-[#F5F0E4]/85 shadow-sm md:block" aria-hidden="true" />
          <div className="absolute inset-x-0 top-4 z-10 flex justify-center px-3 md:static md:mb-6 md:px-0" role="tablist" aria-label="ShareHope impact areas">
            <div className="flex max-w-full gap-2 overflow-x-auto [scrollbar-width:none] md:inline-flex md:gap-1 md:rounded-full md:border md:border-[#E5E0D8] md:bg-[#EFECE6] md:p-1.5">
            {items.map((item, index) => {
              const Icon = iconFor(item.label);
              const selected = activeIndex === index;
              return (
                <button key={`${item.label}-${index}`} type="button" role="tab" aria-selected={selected} onClick={() => setActiveIndex(index)} className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-brand-navy shadow-sm transition sm:px-5 sm:text-xs md:px-5 md:py-2 md:tracking-wider md:shadow-none ${selected ? "bg-[#DCEBFB] md:bg-[#FFC72C] md:text-[#121212] md:shadow-sm" : "bg-white/95 md:bg-transparent md:text-neutral-600 md:hover:text-[#121212]"}`}>
                  {Icon && <Icon size={17} strokeWidth={1.75} aria-hidden="true" className="md:hidden" />}
                  {item.label}
                </button>
              );
            })}
            </div>
          </div>
          <div className="relative">
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-neutral-900 md:aspect-[16/10] md:rounded-sm lg:aspect-[16/9]">
              <Image
                key={`${activeIndex}-${active.imageUrl}`}
                data-visual-key={`why-sharehope-image-${activeIndex}`}
                src={active.imageUrl}
                alt={`${active.label} at ShareHope`}
                fill
                sizes="(min-width: 1200px) 960px, 100vw"
                unoptimized={active.imageUrl.startsWith("/uploads/")}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 hidden bg-gradient-to-t from-black/60 via-transparent to-transparent md:block" aria-hidden="true" />
            </div>
            <div className="relative z-10 mx-4 -mt-28 rounded-[1.75rem] bg-white px-6 pb-8 pt-7 text-center shadow-xl sm:mx-8 md:absolute md:bottom-8 md:right-8 md:mx-0 md:mt-0 md:max-w-sm md:rounded-sm md:border md:border-[#E5E0D8] md:bg-white/95 md:p-6 md:text-left md:backdrop-blur-md">
              <span className="hidden rounded bg-[#EFECE6] px-2.5 py-1 font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-[#121212] md:inline-block">{active.label} pillar</span>
              <p className="text-balance font-serif text-[1.4rem] leading-snug text-brand-navy sm:text-2xl md:mt-3 md:font-sans md:text-sm md:font-medium md:leading-relaxed md:text-neutral-700">{active.description}</p>
              <Link href={active.buttonUrl} className="mt-6 inline-flex items-center gap-2 border-b-4 border-[#FFC72C] pb-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-navy transition hover:text-[#13306B] md:mt-3 md:gap-1.5 md:border-0 md:pb-0 md:text-xs md:tracking-wider md:text-[#121212] md:hover:text-neutral-600">
                {active.buttonText}<ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center font-mono-spaced text-sm font-bold tracking-widest text-brand-navy md:hidden" aria-live="polite">
            {pad(Math.min(activeIndex, items.length - 1) + 1)} / {pad(items.length)}
          </p>
        </div>
      </div>
    </section>
  );
}
