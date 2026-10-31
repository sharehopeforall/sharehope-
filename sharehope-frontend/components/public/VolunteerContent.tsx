"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { CalendarCheck, Globe2, HandHeart, Users } from "lucide-react";
import type { ManagedPageContent } from "@/lib/server/site-page";

const copy = {
  en: {
    eyebrow: "Join the movement",
    title: "Give time. Change lives.",
    lead: "Whether you have an hour a week or a season to give, there's a place for you in our community of volunteers.",
    cta: "Apply to volunteer",
    rolesTitle: "Ways to help",
    rolesLead: "Every role matters. Find the one that fits your life.",
    roles: [
      {
        title: "Help on the ground",
        body: "Join our teams in supporting programs and community activities.",
        icon: HandHeart,
      },
      {
        title: "Share your skills",
        body: "Lend your time and talents — mentoring, teaching, organizing, and more.",
        icon: Users,
      },
      {
        title: "Support our events",
        body: "Pitch in at fundraisers and gatherings throughout the year.",
        icon: CalendarCheck,
      },
      {
        title: "Spread the word",
        body: "Help raise awareness and grow our community of supporters.",
        icon: Globe2,
      },
    ],

    stepsTitle: "How it works",
    steps: [
      { title: "Apply", body: "Tell us about yourself and the role that interests you." },
      { title: "Orientation", body: "Join a short welcome session and meet your coordinator." },
      { title: "Get matched", body: "Start volunteering with a team and project that fits." },
    ],
    spotlightQuote: "Volunteering here changed how I see my own community — I came to give time and stayed for the people.",
    spotlightName: "Amara D.",
    spotlightRole: "Field volunteer, 2 years",
    formTitle: "Volunteer application",
    formLead: "Fill this out and our volunteer coordinator will reach out within a few days.",
    name: "Full name",
    namePlaceholder: "Jane Doe",
    email: "Email address",
    emailPlaceholder: "jane@example.com",
    phone: "Phone number",
    phonePlaceholder: "+1 (555) 123-4567",
    role: "Role of interest",
    availability: "Availability",
    availabilityOptions: ["Weekdays", "Evenings", "Weekends", "Flexible"],
    message: "Anything you'd like us to know? (optional)",
    submit: "Submit application",
    successTitle: "Application received!",
    successBody: "Thank you for raising your hand. Our volunteer coordinator will email you within 3–5 days with next steps.",
    submitAnother: "Submit another application",
  },
  fr: {
    eyebrow: "Rejoignez le mouvement",
    title: "Donnez du temps. Changez des vies.",
    lead: "Que vous ayez une heure par semaine ou une saison à offrir, il y a une place pour vous dans notre communauté de bénévoles.",
    cta: "Devenir bénévole",
    rolesTitle: "Comment aider",
    rolesLead: "Chaque rôle compte. Trouvez celui qui convient à votre vie.",
    roles: [
      {
        title: "Aider sur le terrain",
        body: "Rejoignez nos équipes pour soutenir les programmes et les activités communautaires.",
        icon: HandHeart,
      },
      {
        title: "Partager vos talents",
        body: "Offrez votre temps et vos compétences — mentorat, enseignement, organisation, et plus.",
        icon: Users,
      },
      {
        title: "Soutenir nos événements",
        body: "Donnez un coup de main lors des collectes de fonds et des rassemblements.",
        icon: CalendarCheck,
      },
      {
        title: "Faire passer le mot",
        body: "Aidez à sensibiliser et à faire grandir notre communauté de soutien.",
        icon: Globe2,
      },
    ],

    stepsTitle: "Comment ça marche",
    steps: [
      { title: "Postulez", body: "Parlez-nous de vous et du rôle qui vous intéresse." },
      { title: "Orientation", body: "Participez à une courte session d'accueil et rencontrez votre coordonnateur." },
      { title: "Jumelage", body: "Commencez avec une équipe et un projet qui vous correspondent." },
    ],
    spotlightQuote: "Le bénévolat ici a changé ma façon de voir ma propre communauté — je suis venue donner du temps, je suis restée pour les gens.",
    spotlightName: "Amara D.",
    spotlightRole: "Bénévole de terrain depuis 2 ans",
    formTitle: "Candidature de bénévolat",
    formLead: "Remplissez ce formulaire et notre coordonnateur des bénévoles vous contactera sous quelques jours.",
    name: "Nom complet",
    namePlaceholder: "Jeanne Dupont",
    email: "Adresse courriel",
    emailPlaceholder: "jeanne@exemple.com",
    phone: "Numéro de téléphone",
    phonePlaceholder: "+1 (555) 123-4567",
    role: "Rôle souhaité",
    availability: "Disponibilité",
    availabilityOptions: ["En semaine", "En soirée", "Fins de semaine", "Flexible"],
    message: "Quelque chose à nous dire ? (facultatif)",
    submit: "Envoyer ma candidature",
    successTitle: "Candidature reçue !",
    successBody: "Merci d'avoir levé la main. Notre coordonnateur des bénévoles vous écrira sous 3 à 5 jours pour la suite.",
    submitAnother: "Envoyer une autre candidature",
  },
} as const;

export default function VolunteerContent({ locale, managed }: { locale: string; managed?: ManagedPageContent | null }) {
  const base = locale === "fr" ? copy.fr : copy.en;
  const t = { ...base, title: managed?.title || base.title, eyebrow: managed?.subtitle || base.eyebrow, lead: managed?.body || base.lead, cta: managed?.buttonText || base.cta };
  const [selectedRole, setSelectedRole] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const goToForm = () => {
    setSubmitted(false);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-brand-cream text-[#121212]">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          <p className="font-mono-spaced text-xs font-bold uppercase text-[#13306B]">{t.eyebrow}</p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-brand-navy sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">{t.lead}</p>
          <button
            onClick={() => goToForm()}
            className="font-mono-spaced inline-flex items-center gap-2 rounded-lg bg-[#FFC72C] px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#121212] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#E2AD17]"
          >
            {t.cta} →
          </button>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"
            alt="Volunteers working together"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-[#E5E0D8] bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-center text-3xl font-bold text-brand-navy sm:text-4xl">{t.rolesTitle}</h2>
          <p className="mt-3 text-center text-slate-600">{t.rolesLead}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.title}
                  className="flex flex-col rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-6 transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-serif mt-4 text-lg font-semibold">{role.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{role.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-brand-navy px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-center text-3xl font-bold sm:text-4xl">{t.stepsTitle}</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {t.steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="font-serif mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFC72C] text-2xl font-bold text-[#121212]">
                  {i + 1}
                </div>
                <h3 className="font-serif mt-5 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight + form */}
      <section ref={formRef} className="mx-auto grid max-w-6xl scroll-mt-24 items-start gap-12 px-6 py-20 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-8 shadow-sm lg:sticky lg:top-24">
          <span className="font-serif text-6xl leading-none text-[#FFC72C]">“</span>
          <p className="font-serif -mt-4 text-xl font-medium leading-relaxed text-brand-navy sm:text-2xl">
            {t.spotlightQuote}
          </p>
          <div className="mt-6 border-t border-stone-200 pt-4">
            <p className="font-bold text-[#121212]">{t.spotlightName}</p>
            <p className="font-mono-spaced mt-0.5 text-[10px] uppercase text-slate-500">{t.spotlightRole}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-8 shadow-sm">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">✓</div>
              <h3 className="font-serif mt-5 text-2xl font-bold text-brand-navy">{t.successTitle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.successBody}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-mono-spaced mt-6 rounded-lg border border-[#E5E0D8] px-6 py-3 text-xs font-bold uppercase text-slate-700 transition-colors hover:border-brand-navy"
              >
                {t.submitAnother}
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-2xl font-bold text-brand-navy">{t.formTitle}</h3>
              <p className="mt-2 text-sm text-slate-600">{t.formLead}</p>
              <form
                className="mt-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubmitting(true); setSubmitError(false);
                  const data = new FormData(e.currentTarget);
                  const names = String(data.get("fullName") || "").trim().split(/\s+/);
                  const firstName = names.shift() || ""; const lastName = names.join(" ") || firstName;
                  try {
                    const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submissionType: "VOLUNTEER", firstName, lastName, email: data.get("email"), phone: data.get("phone"), subject: data.get("role"), details: `Availability: ${data.get("availability")}\n${data.get("message") || ""}`, locale: locale === "fr" ? "fr" : "en" }) });
                    if (!response.ok) throw new Error(); setSubmitted(true);
                  } catch { setSubmitError(true); } finally { setSubmitting(false); }
                }}
              >
                <div>
                  <label className="font-mono-spaced mb-1.5 block text-[10px] font-bold uppercase text-slate-500">{t.name}</label>
                  <input required name="fullName" autoComplete="name" type="text" placeholder={t.namePlaceholder} className="w-full rounded border border-[#E5E0D8] p-3 text-sm focus:border-brand-navy focus:outline-none" />
                </div>
                <div>
                  <label className="font-mono-spaced mb-1.5 block text-[10px] font-bold uppercase text-slate-500">{t.email}</label>
                  <input required name="email" type="email" autoComplete="email" placeholder={t.emailPlaceholder} className="w-full rounded border border-[#E5E0D8] p-3 text-sm focus:border-brand-navy focus:outline-none" />
                </div>
                <div>
                  <label className="font-mono-spaced mb-1.5 block text-[10px] font-bold uppercase text-slate-500">{t.phone}</label>
                  <input required type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder={t.phonePlaceholder} className="w-full rounded border border-[#E5E0D8] p-3 text-sm focus:border-brand-navy focus:outline-none" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-mono-spaced mb-1.5 block text-[10px] font-bold uppercase text-slate-500">{t.role}</label>
                    <select name="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(Number(e.target.value))}
                      className="w-full rounded border border-[#E5E0D8] bg-white p-3 text-sm focus:border-brand-navy focus:outline-none"
                    >
                      {t.roles.map((role, i) => (
                        <option key={role.title} value={i}>{role.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono-spaced mb-1.5 block text-[10px] font-bold uppercase text-slate-500">{t.availability}</label>
                    <select name="availability" className="w-full rounded border border-[#E5E0D8] bg-white p-3 text-sm focus:border-brand-navy focus:outline-none">
                      {t.availabilityOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-mono-spaced mb-1.5 block text-[10px] font-bold uppercase text-slate-500">{t.message}</label>
                  <textarea name="message" rows={3} className="w-full rounded border border-[#E5E0D8] p-3 text-sm focus:border-brand-navy focus:outline-none" />
                </div>
                <button
                  type="submit" disabled={submitting}
                  className="font-mono-spaced w-full rounded-lg bg-[#FFC72C] py-4 text-xs font-bold uppercase tracking-widest text-[#121212] shadow-md transition-all hover:bg-[#E2AD17] active:scale-[0.99]"
                >
                  {submitting ? (locale === "fr" ? "Envoi…" : "Submitting…") : t.submit}
                </button>
                {submitError && <p role="alert" className="text-sm font-semibold text-red-700">{locale === "fr" ? "Impossible d’envoyer la candidature. Réessayez." : "We couldn't submit your application. Please try again."}</p>}
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
