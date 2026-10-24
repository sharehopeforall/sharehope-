"use client";

import Image from "next/image";
import { ArrowRight, ImagePlus, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface MissionContent {
  title?: string | null;
  body?: string | null;
  buttonText?: string | null;
  ctaUrl?: string | null;
  imageUrl?: string | null;
  accentText?: string | null;
  eyebrow?: string;
}

interface MissionEditor {
  onChange: (field: "title" | "body" | "buttonText", value: string) => void;
  onReplaceImage?: () => void;
  isUploading?: boolean;
  replacePhotoLabel?: string;
}

export default function MissionSection({ content = {}, editor }: { content?: MissionContent; editor?: MissionEditor }) {
  const title = content.title ?? "Creating opportunities. Building brighter futures.";
  const titleParts = title.split(/(?<=\.)\s+/, 2);
  const accentLines = (content.accentText ?? "Hope Empowers Communities").split(" ");

  return (
    <section id="our-mission" className="scroll-mt-20 overflow-hidden border-t border-[#E5E0D8] bg-[#EFECE6]/40 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-6">
          <div className="font-mono-spaced text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">
            {(content.eyebrow ?? "Our Mission").replace(/\s*[—–-]\s*$/, "")} —
          </div>

          <h2 className="max-w-[650px] text-balance font-serif text-3xl leading-tight text-[#121212] sm:text-5xl">
            {editor ? (
              <textarea aria-label="Heading" rows={3} value={title} onChange={(event) => editor.onChange("title", event.target.value)} className="w-full resize-none border-0 bg-transparent p-0 font-inherit text-inherit outline-none focus:ring-2 focus:ring-[#FFC72C]/50" />
            ) : <>{titleParts[0]}{titleParts[1] && <><br />{titleParts[1]}</>}</>}
          </h2>

          <p className="max-w-[590px] text-sm font-medium leading-relaxed text-neutral-700 sm:text-base">
            {editor ? (
              <textarea aria-label="Description" rows={5} value={content.body ?? ""} onChange={(event) => editor.onChange("body", event.target.value)} className="w-full resize-none border-0 bg-transparent p-0 font-inherit text-inherit outline-none focus:ring-2 focus:ring-[#FFC72C]/50" />
            ) : content.body ?? "ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives."}
          </p>

          {editor ? (
            <div className="inline-flex items-center gap-2 rounded-sm border-2 border-[#FFC72C] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#121212]">
              <input aria-label="Button Text" value={content.buttonText ?? ""} onChange={(event) => editor.onChange("buttonText", event.target.value)} className="min-w-0 border-0 bg-transparent uppercase outline-none" />
              <ArrowRight size={19} aria-hidden="true" />
            </div>
          ) : (
            <Link href={content.ctaUrl ?? "/about"} className="inline-flex items-center gap-2 rounded-sm border-2 border-[#FFC72C] px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#121212] transition hover:bg-[#FFC72C]">
              {content.buttonText ?? "Learn More About Us"}<ArrowRight size={19} aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="relative flex justify-center lg:col-span-6">
          <div className="relative w-full max-w-md rotate-2 rounded-sm border border-neutral-200 bg-white p-4 pb-12 shadow-2xl transition-transform duration-300 hover:rotate-0">
            <div className="absolute -top-4 left-1/3 z-20 h-6 w-24 -rotate-3 border-x border-dashed border-[#B4AA96]/40 bg-[#F5F0E4]/85 shadow-sm" aria-hidden="true" />
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-100">
            <Image
              src={content.imageUrl ?? "/images/hero-placeholders/children-school.png"}
              alt="Children supported by ShareHope"
              fill
              sizes="(min-width: 1024px) 448px, 100vw"
              unoptimized={(content.imageUrl ?? "").startsWith("/uploads/")}
              className="object-cover"
            />
            {editor?.onReplaceImage && <button type="button" onClick={editor.onReplaceImage} disabled={editor.isUploading} className="absolute inset-0 flex items-center justify-center bg-black/0 font-semibold text-white opacity-0 transition hover:bg-black/45 hover:opacity-100 focus:bg-black/45 focus:opacity-100">{editor.isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ImagePlus className="mr-2 h-5 w-5" />}{editor.replacePhotoLabel ?? "Replace photo"}</button>}
            </div>
            <div className="absolute -bottom-3 -left-4 -rotate-6 rounded border border-[#E5E0D8] bg-white px-4 py-2 font-handwriting text-2xl font-bold text-[#121212] shadow-lg sm:-left-6 sm:text-3xl">
              {accentLines.join(" ")} ♡
            </div>
            <div className="pt-4 text-center font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-neutral-500">Field update • Direct support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
