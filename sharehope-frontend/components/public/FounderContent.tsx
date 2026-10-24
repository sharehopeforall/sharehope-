import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ManagedPageContent } from "@/lib/server/site-page";

const copy = {
  eyebrow: "Meet our founder",
  title: "A promise that became a lasting commitment.",
  intro: "Marie founded ShareHope after one classroom changed the way she understood service, partnership, and what it means to truly listen.",
  imageAlt: "Marie L., founder and director of ShareHope",
  role: "Marie L. · Founder & Director",
  letter: [
    "I did not travel abroad intending to start an organization. I went as a teacher, ready to help for two weeks. Then I met a school principal caring for forty students with only twelve textbooks—and I made a promise to help her find the resources the classroom needed.",
    "That first promise taught me something I still carry into every partnership: communities already know what progress looks like. Our responsibility is to listen, bring the right people and resources together, and stay accountable for the long term.",
    "ShareHope has grown, but our approach has not changed. Every program starts with local leadership, every decision is grounded in dignity, and every result belongs to the community that made it possible.",
  ],
  milestones: [
    { value: "2016", label: "The first promise" },
    { value: "12", label: "Countries reached" },
    { value: "Today", label: "Local leaders guide every program" },
  ],
  principles: [
    { number: "01", title: "Listen first", body: "Start with local knowledge, lived experience, and the priorities communities set for themselves." },
    { number: "02", title: "Work locally", body: "Build alongside trusted leaders who understand the culture, context, and long-term opportunity." },
    { number: "03", title: "Stay accountable", body: "Measure what matters, communicate honestly, and remain present beyond a single campaign or season." },
  ],
};

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function FounderContent({ locale, managed }: { locale: string; managed?: ManagedPageContent | null }) {
  const page = { ...copy, title: managed?.title || copy.title, eyebrow: managed?.subtitle || copy.eyebrow, intro: managed?.body || copy.intro };
  return (
    <main data-locale={locale} className="overflow-hidden bg-[#FAF6ED] text-brand-navy">
      <section className="border-b border-brand-navy/10">
        <div className="mx-auto grid min-h-[690px] max-w-[1440px] lg:grid-cols-[1.02fr_.98fr]">
          <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2D8A56]">{page.eyebrow}</p>
              <h1 className="mt-7 max-w-xl font-serif text-[2.8rem] font-semibold leading-[1.06] tracking-[-0.025em] sm:text-[3.6rem] xl:text-[4.4rem]">{page.title}</h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{page.intro}</p>
              <a href="#founder-letter" className="mt-9 inline-flex items-center gap-3 border-b-2 border-brand-navy pb-2 text-xs font-black uppercase tracking-[0.18em] transition hover:gap-5">
                Read her story <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <figure className="relative min-h-[520px] overflow-hidden bg-brand-navy lg:min-h-full">
            <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=88" alt={copy.imageAlt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-center" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/25 to-transparent px-7 pb-8 pt-24 text-white sm:px-10">
              <figcaption className="text-xs font-bold uppercase tracking-[0.2em]">{copy.role}</figcaption>
            </div>
          </figure>
        </div>
      </section>

      <section id="founder-letter" className="bg-white px-6 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2D8A56]">A letter from Marie</p>
            <h2 className="mt-5 max-w-sm font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.02em] sm:text-5xl">This work began by listening.</h2>
          </div>
          <div className="max-w-2xl space-y-6 text-[1.05rem] leading-8 text-slate-700">
            {copy.letter.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="pt-3">
              <p className="font-serif text-4xl italic text-brand-navy">Marie</p>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">{copy.role}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-navy px-6 text-white sm:px-10">
        <div className="mx-auto grid max-w-6xl divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {copy.milestones.map((item) => (
            <div key={item.label} className="px-2 py-10 first:md:pl-0 last:md:pr-0 md:px-8 md:py-12">
              <p className="font-serif text-4xl font-semibold text-[#FFC72C]">{item.value}</p>
              <p className="mt-2 max-w-[16rem] text-sm leading-6 text-white/75">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[.92fr_1.08fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#2D8A56]">What guides her</p>
              <h2 className="mt-5 max-w-lg font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.02em] sm:text-5xl">Leadership rooted in partnership.</h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-slate-600 lg:justify-self-end">Three principles keep ShareHope close to the people and communities at the center of the work.</p>
          </div>
          <div className="mt-14 grid overflow-hidden border border-brand-navy/15 bg-white lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[440px] lg:min-h-[620px]">
              <Image src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=85" alt="Community members working together in the field" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="divide-y divide-brand-navy/15 px-7 py-3 sm:px-10 lg:px-12">
              {copy.principles.map((principle) => (
                <article key={principle.number} className="grid gap-4 py-9 sm:grid-cols-[3rem_1fr]">
                  <span className="text-xs font-black tracking-[0.18em] text-[#F05A24]">{principle.number}</span>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold">{principle.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{principle.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-navy/10 bg-[#F2EBDD] px-6 py-20 sm:px-10 lg:py-24">
        <figure className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-8 h-1 w-16 bg-[#FFC72C]" />
          <blockquote className="font-serif text-3xl font-medium leading-[1.35] tracking-[-0.015em] sm:text-4xl lg:text-5xl">“Communities do not need rescuing. They need resources, respect, and partners who listen—and stay.”</blockquote>
          <figcaption className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{copy.role}</figcaption>
        </figure>
      </section>

      <section className="bg-brand-navy px-6 py-20 text-white sm:px-10 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FFC72C]">Continue the work</p>
            <h2 className="mt-5 max-w-2xl font-serif text-4xl font-semibold leading-[1.12] tracking-[-0.02em] sm:text-5xl">There is a place for you in the next chapter.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/70">Give, volunteer, or build a partnership with ShareHope and help turn local vision into lasting progress.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <Link href="/donate" className="inline-flex items-center justify-between gap-4 bg-[#FFC72C] px-5 py-4 text-xs font-black uppercase tracking-[0.13em] text-brand-navy transition hover:bg-white">Donate <Arrow /></Link>
            <Link href="/volunteer" className="inline-flex items-center justify-between gap-4 border border-white/40 px-5 py-4 text-xs font-black uppercase tracking-[0.13em] transition hover:border-white hover:bg-white hover:text-brand-navy">Volunteer <Arrow /></Link>
            <Link href="/partner" className="inline-flex items-center justify-between gap-4 border border-white/40 px-5 py-4 text-xs font-black uppercase tracking-[0.13em] transition hover:border-white hover:bg-white hover:text-brand-navy">Partner <Arrow /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
