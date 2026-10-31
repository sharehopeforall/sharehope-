"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";

type Props = { locale: string; contactEmail: string };

const interests = {
  en: ["Program sponsorship", "Employee engagement", "Cause marketing", "Foundation or grant support", "Event partnership", "In-kind or professional services"],
  fr: ["Parrainage de programme", "Mobilisation des employés", "Marketing solidaire", "Fondation ou subvention", "Partenariat événementiel", "Services professionnels ou dons en nature"],
};

export default function PartnerInquiryForm({ locale, contactEmail }: Props) {
  const french = locale === "fr";
  const [status, setStatus] = useState<"idle" | "opening">("idle");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selected = form.getAll("interest").join(", ");
    const subject = french ? `Demande de partenariat — ${form.get("organization")}` : `Partnership inquiry — ${form.get("organization")}`;
    const body = [
      `${french ? "Nom" : "Name"}: ${form.get("firstName")} ${form.get("lastName")}`,
      `${french ? "Courriel" : "Email"}: ${form.get("email")}`,
      `${french ? "Téléphone" : "Phone"}: ${form.get("phone") || "—"}`,
      `${french ? "Organisation" : "Organization"}: ${form.get("organization")}`,
      `${french ? "Fonction" : "Role"}: ${form.get("role") || "—"}`,
      `${french ? "Site Web" : "Website"}: ${form.get("website") || "—"}`,
      `${french ? "Type d’organisation" : "Organization type"}: ${form.get("organizationType")}`,
      `${french ? "Intérêts" : "Areas of interest"}: ${selected || "—"}`,
      `${french ? "Budget envisagé" : "Estimated budget"}: ${form.get("budget")}`,
      `${french ? "Calendrier" : "Timeline"}: ${form.get("timeline")}`,
      "",
      `${french ? "Objectifs du partenariat" : "Partnership goals"}:`,
      String(form.get("message")),
    ].join("\n");
    setStatus("opening");
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.setTimeout(() => setStatus("idle"), 1200);
  }

  const input = "mt-2 w-full border border-slate-300 bg-white px-4 py-3.5 text-base text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy";
  const label = "block text-sm font-bold text-brand-navy";

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <legend className="font-serif text-2xl font-semibold text-brand-navy">{french ? "Vos coordonnées" : "Your information"}</legend>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className={label}>{french ? "Prénom" : "First name"}<span className="text-blue-700"> *</span><input className={input} name="firstName" autoComplete="given-name" required /></label>
          <label className={label}>{french ? "Nom" : "Last name"}<span className="text-blue-700"> *</span><input className={input} name="lastName" autoComplete="family-name" required /></label>
          <label className={label}>{french ? "Courriel professionnel" : "Work email"}<span className="text-blue-700"> *</span><input className={input} name="email" type="email" autoComplete="email" required /></label>
          <label className={label}>{french ? "Téléphone" : "Phone number"}<input className={input} name="phone" type="tel" autoComplete="tel" /></label>
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-8">
        <legend className="font-serif text-2xl font-semibold text-brand-navy">{french ? "Votre organisation" : "Your organization"}</legend>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className={label}>{french ? "Nom de l’organisation" : "Organization name"}<span className="text-blue-700"> *</span><input className={input} name="organization" autoComplete="organization" required /></label>
          <label className={label}>{french ? "Votre fonction" : "Your role"}<input className={input} name="role" autoComplete="organization-title" /></label>
          <label className={label}>{french ? "Site Web" : "Website"}<input className={input} name="website" type="url" placeholder="https://" /></label>
          <label className={label}>{french ? "Type d’organisation" : "Organization type"}<span className="text-blue-700"> *</span><select className={input} name="organizationType" required defaultValue=""><option value="" disabled>{french ? "Sélectionner" : "Select one"}</option><option>{french ? "Entreprise" : "Company"}</option><option>{french ? "Fondation" : "Foundation"}</option><option>{french ? "École ou université" : "School or university"}</option><option>{french ? "Organisation communautaire" : "Community organization"}</option><option>{french ? "Groupe religieux" : "Faith community"}</option><option>{french ? "Autre" : "Other"}</option></select></label>
        </div>
      </fieldset>

      <fieldset className="border-t border-slate-200 pt-8">
        <legend className="font-serif text-2xl font-semibold text-brand-navy">{french ? "Votre idée de partenariat" : "Your partnership idea"}</legend>
        <p className="mt-2 text-sm text-slate-600">{french ? "Sélectionnez toutes les options pertinentes." : "Select all that apply."}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{interests[french ? "fr" : "en"].map((item) => <label key={item} className="flex cursor-pointer items-start gap-3 border border-slate-200 p-4 text-sm font-semibold text-brand-navy transition has-[:checked]:border-brand-navy has-[:checked]:bg-blue-50"><input type="checkbox" name="interest" value={item} className="peer sr-only" /><span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-slate-400 bg-white peer-checked:border-brand-navy peer-checked:bg-brand-navy"><Check className="size-3.5 text-white" /></span>{item}</label>)}</div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className={label}>{french ? "Budget envisagé" : "Estimated partnership budget"}<select className={input} name="budget" defaultValue=""><option value="" disabled>{french ? "Sélectionner" : "Select a range"}</option><option>{french ? "Moins de 5 000 $" : "Under $5,000"}</option><option>$5,000–$24,999</option><option>$25,000–$99,999</option><option>$100,000+</option><option>{french ? "À déterminer" : "Not sure yet"}</option></select></label>
          <label className={label}>{french ? "Calendrier souhaité" : "Preferred timeline"}<select className={input} name="timeline" defaultValue=""><option value="" disabled>{french ? "Sélectionner" : "Select a timeline"}</option><option>{french ? "Dès que possible" : "As soon as possible"}</option><option>{french ? "Dans les 3 prochains mois" : "Within 3 months"}</option><option>{french ? "Dans les 6 prochains mois" : "Within 6 months"}</option><option>{french ? "Cette année" : "Within the year"}</option><option>{french ? "Exploration préliminaire" : "Early exploration"}</option></select></label>
        </div>
        <label className={`${label} mt-6`}>{french ? "Parlez-nous de vos objectifs" : "Tell us about your goals"}<span className="text-blue-700"> *</span><textarea className={`${input} min-h-40 resize-y`} name="message" required maxLength={2000} placeholder={french ? "Que souhaitez-vous accomplir avec ShareHope?" : "What would you like to accomplish with ShareHope?"} /></label>
      </fieldset>

      <div className="border-t border-slate-200 pt-8">
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" required className="mt-1 size-4 accent-brand-navy" /><span>{french ? "J’accepte que ShareHope utilise ces renseignements pour répondre à ma demande de partenariat." : "I agree that ShareHope may use this information to respond to my partnership inquiry."}</span></label>
        <button disabled={status === "opening"} className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-brand-navy px-7 py-4 text-sm font-bold uppercase tracking-[.12em] text-white transition hover:bg-[#13306B] disabled:cursor-wait disabled:opacity-70 sm:w-auto">{status === "opening" ? <LoaderCircle className="size-4 animate-spin" /> : null}{french ? "Envoyer la demande" : "Send partnership inquiry"}<ArrowRight className="size-4" /></button>
        <p className="mt-4 max-w-xl text-xs leading-5 text-slate-500">{french ? "Votre application de courriel s’ouvrira avec les renseignements complétés. Vérifiez-les, puis envoyez le message." : "Your email application will open with the completed details. Review them, then send the message."}</p>
      </div>
    </form>
  );
}
