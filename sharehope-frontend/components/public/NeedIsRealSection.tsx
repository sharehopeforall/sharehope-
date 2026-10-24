import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const content = {
  en: {
    eyebrow: "The Need Is Real",
    title: "Millions of children and young adults still lack the opportunity to thrive.",
    body: "We support children, young adults, and families with education, food assistance, life skills, and essential resources, helping them build healthier, more independent futures.",
    button: "Give Today",
    stats: [
      { value: "1,200+", label: "People supported" },
      { value: "5", label: "Programs" },
      { value: "2", label: "Countries" },
    ],
  },
  fr: {
    eyebrow: "Le besoin est bien réel",
    title: "Des millions d'enfants et de jeunes adultes n'ont toujours pas la possibilité de s'épanouir.",
    body: "Nous soutenons les enfants, les jeunes adultes et les familles par l'éducation, l'aide alimentaire, les compétences de vie et les ressources essentielles, afin de les aider à bâtir un avenir plus sain et plus autonome.",
    button: "Donnez aujourd'hui",
    stats: [
      { value: "1 200+", label: "Personnes soutenues" },
      { value: "5", label: "Programmes" },
      { value: "2", label: "Pays" },
    ],
  },
} as const;

interface NeedContent {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  buttonText?: string | null;
  ctaUrl?: string | null;
  stats?: Array<{ value: string; label: string }> | null;
}

interface NeedEditor {
  onChange: (field: "eyebrow" | "title" | "body" | "buttonText", value: string) => void;
  onStatChange: (index: number, field: "value" | "label", value: string) => void;
}

export default function NeedIsRealSection({ locale, content: managedContent, editor }: { locale: string; content?: NeedContent; editor?: NeedEditor }) {
  const fallback = locale === "fr" ? content.fr : content.en;
  const section = {
    ...fallback,
    eyebrow: managedContent?.eyebrow ?? fallback.eyebrow,
    title: managedContent?.title ?? fallback.title,
    body: managedContent?.body ?? fallback.body,
    button: managedContent?.buttonText ?? fallback.button,
    stats: managedContent?.stats?.length === 3 ? managedContent.stats : fallback.stats,
  };

  return (
    <section id="need-is-real" className="scroll-mt-20 border-t border-[#E5E0D8] bg-[#FAF7F2] px-6 py-20">
      <div className="mx-auto max-w-5xl space-y-8 text-center">
        {editor ? <input aria-label="Eyebrow" value={section.eyebrow} onChange={(event) => editor.onChange("eyebrow", event.target.value)} className="mx-auto block w-full border-0 bg-transparent text-center font-mono-spaced text-xs font-bold uppercase tracking-[0.25em] text-neutral-600 outline-none focus:ring-2 focus:ring-[#FFC72C]/30" /> : <p className="font-mono-spaced text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">{section.eyebrow}</p>}

        {editor ? <textarea aria-label="Heading" rows={2} value={section.title} onChange={(event) => editor.onChange("title", event.target.value)} className="mx-auto block w-full max-w-3xl resize-none border-0 bg-transparent text-center font-serif text-3xl leading-tight text-[#121212] outline-none focus:ring-2 focus:ring-[#FFC72C]/30 sm:text-5xl" /> : <h2 className="mx-auto max-w-3xl text-balance font-serif text-3xl leading-tight text-[#121212] sm:text-5xl">{section.title}</h2>}

        {editor ? <textarea aria-label="Description" rows={3} value={section.body} onChange={(event) => editor.onChange("body", event.target.value)} className="mx-auto block w-full max-w-3xl resize-none border-0 bg-transparent text-center text-sm font-medium leading-relaxed text-neutral-700 outline-none focus:ring-2 focus:ring-[#FFC72C]/30 sm:text-base" /> : <p className="mx-auto max-w-3xl text-sm font-medium leading-relaxed text-neutral-700 sm:text-base">{section.body}</p>}

        {editor ? (
          <div className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FFC72C] px-8 py-4 text-xs font-black uppercase tracking-widest text-[#121212] shadow-lg">
            <input aria-label="Button text" value={section.button} onChange={(event) => editor.onChange("buttonText", event.target.value)} className="min-w-0 max-w-40 border-0 bg-transparent text-center text-white outline-none" />
            <ArrowRight size={20} aria-hidden="true" />
          </div>
        ) : (
          <Link href={managedContent?.ctaUrl ?? "/donate"} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#FFC72C] px-8 py-4 text-xs font-black uppercase tracking-widest text-[#121212] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#E2AD17] hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#121212]">
            {section.button}<ArrowRight size={20} aria-hidden="true" />
          </Link>
        )}

        <dl className="mx-auto grid max-w-[900px] overflow-hidden rounded-sm border border-[#E5E0D8] bg-white p-6 shadow-xl sm:grid-cols-3 sm:p-8">
          {section.stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`space-y-1 px-5 py-5 sm:py-2 ${index > 0 ? "border-t border-[#E5E0D8] sm:border-l sm:border-t-0" : ""}`}
            >
              <dd className="font-mono-spaced text-3xl font-bold text-[#121212] sm:text-4xl">
                {editor ? <input aria-label={`Statistic ${index + 1} value`} value={stat.value} onChange={(event) => editor.onStatChange(index, "value", event.target.value)} className="w-full border-0 bg-transparent text-center outline-none focus:ring-2 focus:ring-brand-green/30" /> : stat.value}
              </dd>
              <dt className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                {editor ? <input aria-label={`Statistic ${index + 1} label`} value={stat.label} onChange={(event) => editor.onStatChange(index, "label", event.target.value)} className="w-full border-0 bg-transparent text-center outline-none focus:ring-2 focus:ring-brand-green/30" /> : stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
