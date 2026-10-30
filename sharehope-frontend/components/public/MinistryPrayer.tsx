"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Flame, HandHeart, HeartPulse } from "lucide-react";

const GROUP_ICONS = [Flame, HandHeart, HeartPulse] as const;

interface PrayerGroup {
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  keyVerse: string;
  keyVerseRef: string;
  prayers: readonly { title: string; body: string; verse: string }[];
}

interface MinistryPrayerProps {
  eyebrow: string;
  title: string;
  lead: string;
  commitLabel: string;
  committedLabel: string;
  groups: readonly PrayerGroup[];
}

export default function MinistryPrayer({ eyebrow, title, lead, commitLabel, committedLabel, groups }: MinistryPrayerProps) {
  const [active, setActive] = useState(0);
  const [committed, setCommitted] = useState<Set<number>>(new Set());
  const group = groups[active];
  const isCommitted = committed.has(active);

  return (
    <section className="bg-brand-navy px-6 py-20 text-white lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono-spaced text-xs font-bold uppercase text-[#FFC72C]">{eyebrow}</p>
          <h2 className="font-serif mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">{lead}</p>
        </div>

        {/* Tabs */}
        <div role="tablist" className="mx-auto mt-10 flex w-fit flex-wrap justify-center gap-2 rounded-full bg-white/10 p-1.5">
          {groups.map((g, i) => {
            const Icon = GROUP_ICONS[i];
            const selected = i === active;
            return (
              <button
                key={g.title}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(i)}
                className={`font-mono-spaced flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase transition-all ${
                  selected ? "bg-[#FFC72C] text-[#121212] shadow-md" : "text-white/70 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {g.title}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div role="tabpanel" className="mt-12 grid overflow-hidden rounded-2xl bg-white text-[#121212] shadow-2xl lg:grid-cols-[2fr_3fr]">
          {/* Image + key verse */}
          <div className="relative min-h-[320px]">
            <Image
              key={group.image}
              src={group.image}
              alt={group.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <figure className="absolute inset-x-0 bottom-0 p-7 text-white">
              <blockquote className="font-serif text-xl leading-relaxed sm:text-2xl">{group.keyVerse}</blockquote>
              <figcaption className="font-mono-spaced mt-3 text-[10px] font-bold uppercase text-[#FFC72C]">
                {group.keyVerseRef}
              </figcaption>
            </figure>
          </div>

          {/* Prayer list */}
          <div className="flex flex-col p-7 sm:p-10">
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{group.intro}</p>
            <ol className="mt-8 flex-1 space-y-7">
              {group.prayers.map((prayer, i) => (
                <li key={prayer.title} className="flex gap-5">
                  <span className="font-serif text-3xl font-bold leading-none text-[#FFC72C]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-brand-navy">{prayer.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{prayer.body}</p>
                    <p className="font-mono-spaced mt-2 text-[10px] font-bold uppercase text-brand-navy">{prayer.verse}</p>
                  </div>
                </li>
              ))}
            </ol>
            <button
              onClick={() =>
                setCommitted((prev) => {
                  const next = new Set(prev);
                  if (next.has(active)) next.delete(active);
                  else next.add(active);
                  return next;
                })
              }
              aria-pressed={isCommitted}
              className={`font-mono-spaced mt-10 inline-flex items-center justify-center gap-2 self-start rounded-lg border-2 border-brand-navy px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-all ${
                isCommitted
                  ? "text-brand-navy"
                  : "bg-brand-navy text-white hover:-translate-y-0.5 hover:border-[#0a1f33] hover:bg-[#0a1f33]"
              }`}
            >
              {isCommitted && <Check size={15} />}
              {isCommitted ? committedLabel : commitLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
