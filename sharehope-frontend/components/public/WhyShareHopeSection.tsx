"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
    <section id="why-sharehope" className="scroll-mt-20 border-t border-[#E5E0D8] bg-[#FAF7F2] py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-5 px-5 text-center sm:space-y-3 sm:px-0">
          <p data-visual-key="why-sharehope-eyebrow" className="font-mono-spaced text-sm font-bold uppercase tracking-[0.22em] text-[#242824] sm:text-xs sm:tracking-[0.25em] sm:text-neutral-600">{eyebrow}</p>
          <h2 className="mx-auto max-w-[760px] text-balance font-serif text-[clamp(2.55rem,10.8vw,3.35rem)] leading-[0.98] tracking-[-0.04em] text-[#20241F] sm:text-5xl sm:leading-normal sm:tracking-tight sm:text-[#121212]">
            {titleBreak ? <>{titleBreak[1]}<br />{titleBreak[2].trim()}</> : title}
          </h2>
        </div>

        <div className="relative mx-auto max-w-6xl bg-[#181B18] pb-10 sm:rounded-sm sm:border sm:border-[#E5E0D8] sm:bg-white sm:p-6 sm:pb-6 sm:shadow-xl lg:p-8">
          <div className="absolute -top-3 left-1/2 z-20 hidden h-6 w-28 -translate-x-1/2 border-x border-dashed border-[#B4AA96]/40 bg-[#F5F0E4]/85 shadow-sm sm:block" aria-hidden="true" />
          <div className="flex justify-center px-3 pb-5 pt-6 sm:mb-6 sm:p-0" role="tablist" aria-label="ShareHope impact areas">
            <div className="flex max-w-full flex-wrap justify-center gap-2.5 sm:inline-flex sm:flex-nowrap sm:gap-1 sm:overflow-x-auto sm:rounded-full sm:border sm:border-[#E5E0D8] sm:bg-[#EFECE6] sm:p-1.5">
            {items.map((item, index) => (
              <button key={`${item.label}-${index}`} type="button" role="tab" aria-selected={activeIndex === index} onClick={() => setActiveIndex(index)} className={`whitespace-nowrap rounded-2xl border-2 border-[#090B09] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] shadow-sm transition sm:rounded-full sm:border-0 sm:px-5 sm:py-2 sm:tracking-wider ${activeIndex === index ? "bg-[#DDEAF1] text-[#121212] sm:bg-[#FFC72C]" : "bg-white text-[#252925] sm:bg-transparent sm:text-neutral-600 sm:shadow-none sm:hover:text-[#121212]"}`}>
                {item.label}
              </button>
            ))}
            </div>
          </div>
          <div className="group relative w-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900 sm:aspect-[16/10] sm:rounded-sm lg:aspect-[16/9]">
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
              <div className="absolute inset-0 hidden bg-gradient-to-t from-black/60 via-transparent to-transparent sm:block" aria-hidden="true" />
            </div>
            <div className="relative z-10 mx-4 -mt-14 rounded-2xl bg-white px-5 py-7 text-center shadow-xl sm:absolute sm:bottom-8 sm:left-auto sm:right-8 sm:mx-0 sm:mt-0 sm:max-w-sm sm:rounded-sm sm:border sm:border-[#E5E0D8] sm:bg-white/95 sm:p-6 sm:text-left sm:backdrop-blur-md">
              <span className="hidden rounded bg-[#EFECE6] px-2.5 py-1 font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-[#121212] sm:inline-block">{active.label} pillar</span>
              <p className="text-base font-medium leading-relaxed text-neutral-800 sm:mt-3 sm:text-sm sm:text-neutral-700">{active.description}</p>
              <Link href={active.buttonUrl} className="mt-6 inline-flex items-center gap-1.5 border-b-4 border-[#FFC72C] pb-1 text-xs font-bold uppercase tracking-[0.1em] text-[#202420] transition hover:text-neutral-600 sm:mt-3 sm:border-0 sm:pb-0 sm:tracking-wider sm:text-[#121212]">
                {active.buttonText}<ArrowRight className="hidden sm:block" size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
