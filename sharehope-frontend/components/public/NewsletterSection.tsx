"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";

const copy = {
  en: {
    eyebrow: "Stay Connected",
    title: "Get stories of hope\nin your inbox.",
    body: "Receive updates on our programs, upcoming events, and meaningful ways to support ShareHope.",
    firstName: "First Name",
    lastName: "Last Name",
    firstPlaceholder: "First name",
    lastPlaceholder: "Last name",
    email: "Email",
    emailPlaceholder: "Your email address",
    button: "Subscribe",
    helper: "Stay connected with stories, updates, and ways to get involved.",
    success: "Thank you for subscribing to ShareHope.",
    error: "We couldn't add you right now. Please try again.",
  },
  fr: {
    eyebrow: "Restons en contact",
    title: "Recevez des histoires d'espoir\ndans votre boîte de réception.",
    body: "Recevez des nouvelles de nos programmes, de nos événements et des façons significatives de soutenir ShareHope.",
    firstName: "Prénom",
    lastName: "Nom",
    firstPlaceholder: "Votre prénom",
    lastPlaceholder: "Votre nom",
    email: "Courriel",
    emailPlaceholder: "Votre adresse courriel",
    button: "S'abonner",
    helper: "Restez en contact grâce à nos histoires, nos nouvelles et nos façons de vous impliquer.",
    success: "Merci de vous être abonné à ShareHope.",
    error: "Votre inscription n'a pas pu être enregistrée. Veuillez réessayer.",
  },
} as const;

interface NewsletterContent {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  buttonText?: string | null;
}

interface NewsletterEditor {
  onChange: (field: "eyebrow" | "title" | "body" | "buttonText", value: string) => void;
}

export default function NewsletterSection({ locale, content: managedContent, editor }: { locale: string; content?: NewsletterContent; editor?: NewsletterEditor }) {
  const fallback = locale === "fr" ? copy.fr : copy.en;
  const section = {
    ...fallback,
    eyebrow: managedContent?.eyebrow ?? fallback.eyebrow,
    title: managedContent?.title ?? fallback.title,
    body: managedContent?.body ?? fallback.body,
    button: managedContent?.buttonText ?? fallback.button,
  };
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          locale: locale === "fr" ? "fr" : "en",
        }),
      });
      if (!response.ok) throw new Error("Subscription failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const fieldClass = "h-12 w-full rounded border border-[#E5E0D8] bg-white px-4 text-sm text-[#121212] outline-none placeholder:text-neutral-400 transition focus:border-[#FFC72C] focus:ring-2 focus:ring-[#FFC72C]/20";

  return (
    <section id="newsletter" className="relative scroll-mt-24 overflow-hidden bg-[#FAF7F2] px-6 py-20">
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white p-8 shadow-xl sm:p-12">
        <div className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 border-x border-dashed border-[#B4AA96]/40 bg-[#F5F0E4]/85 shadow-sm" aria-hidden="true" />
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-2">
              {editor ? <input aria-label="Eyebrow" value={section.eyebrow} onChange={(event) => editor.onChange("eyebrow", event.target.value)} className="w-full border-0 bg-transparent font-mono-spaced text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] outline-none focus:ring-2 focus:ring-[#FFC72C]/30" /> : <p className="font-mono-spaced text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212]">{section.eyebrow}</p>}
              {editor ? <textarea aria-label="Heading" rows={2} value={section.title} onChange={(event) => editor.onChange("title", event.target.value)} className="w-full resize-none whitespace-pre-line border-0 bg-transparent font-serif text-3xl font-bold leading-tight text-[#121212] outline-none focus:ring-2 focus:ring-[#FFC72C]/30 sm:text-4xl" /> : <h2 className="whitespace-pre-line font-serif text-3xl font-bold leading-tight text-[#121212] sm:text-4xl">{section.title}</h2>}
              {editor ? <textarea aria-label="Description" rows={3} value={section.body} onChange={(event) => editor.onChange("body", event.target.value)} className="w-full resize-none border-0 bg-transparent text-sm font-medium leading-relaxed text-neutral-600 outline-none focus:ring-2 focus:ring-[#FFC72C]/30" /> : <p className="text-sm font-medium leading-relaxed text-neutral-600">{section.body}</p>}
            </div>
            <div className="inline-block max-w-[260px] -rotate-2 rounded-sm border border-[#E5E0D8] bg-[#FAF7F2] p-3 pb-6 shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-100">
                <Image src="/images/hero-placeholders/children-school.png" alt="ShareHope field updates" fill sizes="260px" className="object-cover" />
              </div>
              <p className="pt-2 text-center font-handwriting text-sm font-bold text-[#121212]">Direct field notes &amp; story updates ♥</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2]/60 p-6 sm:p-8 lg:col-span-7">
          {status === "success" ? (
            <div className="flex items-center gap-4 text-[#121212]" role="status">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#FFC72C]/20"><Check size={23} aria-hidden="true" /></span>
              <p className="text-[18px] font-semibold">{section.success}</p>
            </div>
          ) : (
            <form className="w-full space-y-4" onSubmit={editor ? (event) => event.preventDefault() : subscribe}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-neutral-700" htmlFor="newsletter-first-name">{section.firstName}</label>
                  <input className={fieldClass} id="newsletter-first-name" name="firstName" required autoComplete="given-name" placeholder={section.firstPlaceholder} maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-neutral-700" htmlFor="newsletter-last-name">{section.lastName}</label>
                  <input className={fieldClass} id="newsletter-last-name" name="lastName" required autoComplete="family-name" placeholder={section.lastPlaceholder} maxLength={100} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-neutral-700" htmlFor="newsletter-email">{section.email}</label>
                <input className={fieldClass} id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder={section.emailPlaceholder} />
              </div>

              {editor ? (
                <div className="inline-flex h-14 w-full items-center justify-center gap-2 rounded bg-[#FFC72C] px-6 text-xs font-black uppercase tracking-widest text-[#121212]">
                  <input aria-label="Button text" value={section.button} onChange={(event) => editor.onChange("buttonText", event.target.value)} className="min-w-0 max-w-48 border-0 bg-transparent text-center outline-none" /><ArrowRight size={19} aria-hidden="true" />
                </div>
              ) : (
                <button type="submit" disabled={status === "loading"} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded bg-[#FFC72C] px-6 text-xs font-black uppercase tracking-widest text-[#121212] shadow transition hover:bg-[#E2AD17] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70">
                  {section.button}<ArrowRight size={19} aria-hidden="true" />
                </button>
              )}
              <p className="pt-1 text-center text-[11px] font-medium text-neutral-500">{section.helper}</p>
              {status === "error" && <p className="mt-3 text-[15px] font-semibold text-[#A33A2C]" role="alert">{section.error}</p>}
            </form>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
