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

  return (
    <section id="why-sharehope" className="scroll-mt-20 border-t border-[#E5E0D8] bg-[#FAF7F2] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-3 text-center">
          <p className="font-mono-spaced text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">{content.eyebrow ?? "Why ShareHope?"}</p>
          <h2 className="mx-auto max-w-[760px] text-balance font-serif text-3xl tracking-tight text-[#121212] sm:text-5xl">
            {titleBreak ? <>{titleBreak[1]}<br />{titleBreak[2].trim()}</> : title}
          </h2>
        </div>

        <div className="relative mx-auto max-w-6xl rounded-sm border border-[#E5E0D8] bg-white p-4 shadow-xl sm:p-6 lg:p-8">
          <div className="absolute -top-3 left-1/2 z-20 h-6 w-28 -translate-x-1/2 border-x border-dashed border-[#B4AA96]/40 bg-[#F5F0E4]/85 shadow-sm" aria-hidden="true" />
          <div className="mb-6 flex justify-center" role="tablist" aria-label="ShareHope impact areas">
            <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#E5E0D8] bg-[#EFECE6] p-1.5">
            {items.map((item, index) => (
              <button key={`${item.label}-${index}`} type="button" role="tab" aria-selected={activeIndex === index} onClick={() => setActiveIndex(index)} className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition ${activeIndex === index ? "bg-[#FFC72C] text-[#121212] shadow-sm" : "text-neutral-600 hover:text-[#121212]"}`}>
                {item.label}
              </button>
            ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#EDE8DF] sm:aspect-[16/10] lg:aspect-[16/9]">
            <Image
              key={`${activeIndex}-${active.imageUrl}`}
              data-visual-key={`why-sharehope-image-${activeIndex}`}
              src={active.imageUrl}
              alt={`${active.label} at ShareHope`}
              fill
              sizes="(min-width: 1200px) 960px, 100vw"
              unoptimized={active.imageUrl.startsWith("/uploads/")}
              className="object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 right-4 rounded-sm border border-[#E5E0D8] bg-white/95 p-5 shadow-xl backdrop-blur-md sm:bottom-8 sm:left-auto sm:right-8 sm:max-w-sm sm:p-6">
              <span className="inline-block rounded bg-[#EFECE6] px-2.5 py-1 font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-[#121212]">{active.label} pillar</span>
              <p className="mt-3 text-xs font-medium leading-relaxed text-neutral-700 sm:text-sm">{active.description}</p>
            <Link href={active.buttonUrl} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#121212] transition hover:text-neutral-600">
              {active.buttonText}<ArrowRight size={17} aria-hidden="true" />
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
