import Image from "next/image";
import { ArrowRight, BookOpen, GraduationCap, School, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const educationImages = {
  hero: "/images/education-hero-presentation.png",
  story: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=85",
  future: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=85",
};

const QUESTION_ICONS = [School, BookOpen, GraduationCap];

export const educationDefaults = {
  en: {
    cardEyebrow: "Why education?",
    cardTitle: "244 million children and youth are out of school.",
    cardBold: "That's nearly 1 in 10 school-aged children worldwide.",
    cardBody:
      "The majority live in remote or underserved communities where tuition fees, uniforms, and long distances put learning out of reach. Without support, these children lose more than lessons—they lose confidence, connection, and the chance to shape their own future.",
    cardCta: "Support education",
    introTitle: "Opportunity begins with access.",
    introBody:
      "For many families, the cost of a uniform, notebook, tuition fee, or trip to school can put education out of reach. ShareHope works alongside communities to remove those barriers—one student, one classroom, and one hopeful next step at a time.",
    storyEyebrow: "The power of learning",
    storyTitle: "Education opens doors that last.",
    storyBody:
      "Reliable access to school gives children structure, practical skills, and the encouragement to keep moving forward. It also strengthens families and creates possibilities that reach far beyond the classroom.",
    quote: "A notebook, a uniform, or help with tuition can be the difference between missing school and continuing to learn.",
    storyNote: "Our education work focuses on removing these practical barriers alongside local families, teachers, and community leaders.",
    bandTitle: "Until every child can take their seat.",
    bandCta: "Support education",
    questionsEyebrow: "Why education matters",
    questionsTitle: "Learning creates change that lasts.",
    questions: [
      { title: "Why does school access matter?", body: "Reliable access to school gives children structure, knowledge, community, and a safer path toward opportunity." },
      { title: "What helps a student stay in school?", body: "Supplies, tuition support, trained teachers, safe learning spaces, and encouragement from trusted adults all make persistence possible." },
      { title: "How does education strengthen communities?", body: "Students carry new skills into their families and neighborhoods, expanding choices and inspiring the next generation to dream further." },
    ],
    futureEyebrow: "School is just the beginning",
    futureTitle: "A lesson today becomes leadership tomorrow.",
    futureBody:
      "Education helps young people see beyond the circumstances in front of them. They become teachers, caregivers, builders, entrepreneurs, and advocates—people equipped to shape stronger communities.",
    storiesEyebrow: "How we help",
    storiesTitle: "Support that meets students where they are.",
    stories: [
      { tag: "Access", title: "School supplies that remove the first barrier", body: "Backpacks, books, uniforms, and learning tools help students arrive ready and proud.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85" },
      { tag: "Belonging", title: "Safe spaces built for learning", body: "Welcoming classrooms and community learning centers give curiosity room to grow.", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=85" },
      { tag: "Potential", title: "Mentorship that keeps hope moving", body: "Caring adults help young people set goals, build life skills, and stay connected to their future.", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85" },
    ],
    finalTitle: "Help a child turn possibility into a plan.",
    finalBody: "Your gift can provide the practical support a student needs to learn, grow, and dream bigger.",
    finalCta: "Give to education",
  },
  fr: {
    cardEyebrow: "Pourquoi l'éducation ?",
    cardTitle: "244 millions d'enfants et de jeunes ne sont pas scolarisés.",
    cardBold: "C'est près de 1 enfant sur 10 en âge scolaire dans le monde.",
    cardBody:
      "La majorité vit dans des régions isolées ou mal desservies où les frais de scolarité, les uniformes et les longs trajets rendent l'apprentissage inaccessible. Sans soutien, ces enfants perdent plus que des leçons : ils perdent confiance, liens et la chance de façonner leur avenir.",
    cardCta: "Soutenir l'éducation",
    introTitle: "Les possibilités commencent par l’accès.",
    introBody:
      "Pour de nombreuses familles, le coût d’un uniforme, d’un cahier, des frais de scolarité ou du trajet peut rendre l’école inaccessible. ShareHope travaille avec les communautés pour lever ces obstacles, un élève et une classe à la fois.",
    storyEyebrow: "Le pouvoir d’apprendre",
    storyTitle: "L’éducation ouvre des portes durables.",
    storyBody:
      "Un accès fiable à l’école apporte aux enfants une structure, des compétences concrètes et l’encouragement nécessaire pour avancer. Il renforce aussi les familles et crée des possibilités bien au-delà de la salle de classe.",
    quote: "Un cahier, un uniforme ou une aide aux frais de scolarité peut faire la différence entre manquer l’école et poursuivre son apprentissage.",
    storyNote: "Notre action éducative vise à lever ces obstacles concrets aux côtés des familles, des enseignants et des responsables communautaires.",
    bandTitle: "Jusqu’à ce que chaque enfant puisse prendre sa place.",
    bandCta: "Soutenir l’éducation",
    questionsEyebrow: "Pourquoi l’éducation compte",
    questionsTitle: "L’apprentissage crée un changement durable.",
    questions: [
      { title: "Pourquoi l’accès à l’école est-il essentiel ?", body: "Un accès fiable à l’école apporte aux enfants structure, connaissances, communauté et une voie plus sûre vers l’avenir." },
      { title: "Qu’est-ce qui aide un élève à poursuivre ses études ?", body: "Le matériel, les bourses, des enseignants formés, des lieux sûrs et l’encouragement d’adultes de confiance rendent la persévérance possible." },
      { title: "Comment l’éducation renforce-t-elle les communautés ?", body: "Les élèves transmettent de nouvelles compétences à leur famille et inspirent la prochaine génération à voir plus loin." },
    ],
    futureEyebrow: "L’école n’est que le début",
    futureTitle: "La leçon d’aujourd’hui devient le leadership de demain.",
    futureBody:
      "L’éducation aide les jeunes à voir au-delà de leur situation. Ils deviennent enseignants, soignants, bâtisseurs, entrepreneurs et défenseurs de communautés plus fortes.",
    storiesEyebrow: "Notre action",
    storiesTitle: "Un soutien adapté à la réalité des élèves.",
    stories: [
      { tag: "Accès", title: "Du matériel scolaire pour lever le premier obstacle", body: "Sacs, livres, uniformes et outils permettent aux élèves d’arriver prêts et fiers.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85" },
      { tag: "Appartenance", title: "Des espaces sûrs conçus pour apprendre", body: "Des classes accueillantes donnent à la curiosité la place de grandir.", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=85" },
      { tag: "Potentiel", title: "Un mentorat qui entretient l’espoir", body: "Des adultes bienveillants aident les jeunes à se fixer des objectifs et à rester liés à leur avenir.", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=85" },
    ],
    finalTitle: "Aidez un enfant à transformer une possibilité en projet.",
    finalBody: "Votre don peut offrir le soutien concret dont un élève a besoin pour apprendre, grandir et rêver plus grand.",
    finalCta: "Donner pour l’éducation",
  },
};

export interface EducationCopy {
  cardEyebrow: string;
  cardTitle: string;
  cardBold: string;
  cardBody: string;
  cardCta: string;
  introTitle: string;
  introBody: string;
  storyEyebrow: string;
  storyTitle: string;
  storyBody: string;
  quote: string;
  storyNote: string;
  bandTitle: string;
  bandCta: string;
  questionsEyebrow: string;
  questionsTitle: string;
  questions: { title: string; body: string }[];
  futureEyebrow: string;
  futureTitle: string;
  futureBody: string;
  storiesEyebrow: string;
  storiesTitle: string;
  stories: { tag: string; title: string; body: string; image: string }[];
  finalTitle: string;
  finalBody: string;
  finalCta: string;
}

export interface EducationPhotos {
  hero?: string;
  story?: string;
  future?: string;
}

export interface EducationEditor {
  onChange: (key: string, value: string) => void;
  onReplacePhoto: (target: "hero" | "story" | "future" | number) => void;
}

interface Props {
  locale: string;
  content?: EducationCopy;
  photos?: EducationPhotos;
  editor?: EducationEditor;
}

export default function EducationContent({ locale, content, photos, editor }: Props) {
  const defaults = locale === "fr" ? educationDefaults.fr : educationDefaults.en;
  const supplied = content ?? defaults;
  const hasLegacyStudentStory =
    supplied.storyEyebrow.toLowerCase().includes("student’s story") ||
    supplied.storyEyebrow.toLowerCase().includes("student's story") ||
    supplied.quote.toLowerCase().includes("i want to learn everything");
  const t: EducationCopy = hasLegacyStudentStory
    ? {
        ...supplied,
        storyEyebrow: defaults.storyEyebrow,
        storyTitle: defaults.storyTitle,
        storyBody: defaults.storyBody,
        quote: defaults.quote,
        storyNote: defaults.storyNote,
      }
    : supplied;
  const heroSrc = photos?.hero ?? educationImages.hero;
  const storySrc = photos?.story ?? educationImages.story;
  const futureSrc = photos?.future ?? educationImages.future;

  const inputCls =
    "w-full resize-none border-0 bg-transparent p-0 outline-none [font:inherit] [letter-spacing:inherit] [text-align:inherit] focus:ring-2 focus:ring-[#FFC72C]/50";

  const ed = (key: string, value: string, multiline = false) =>
    editor ? (
      multiline ? (
        <textarea
          rows={Math.max(2, Math.ceil(value.length / 80))}
          value={value}
          onChange={(event) => editor.onChange(key, event.target.value)}
          className={inputCls}
        />
      ) : (
        <input value={value} onChange={(event) => editor.onChange(key, event.target.value)} className={inputCls} />
      )
    ) : (
      value
    );

  const replaceBtn = (target: "hero" | "story" | "future" | number) =>
    editor ? (
      <button
        type="button"
        onClick={() => editor.onReplacePhoto(target)}
        className="absolute bottom-3 right-3 z-20 rounded-md bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-navy shadow-lg transition hover:bg-white"
      >
        Replace photo
      </button>
    ) : null;

  const ctaClass =
    "mt-8 inline-flex items-center gap-3 rounded-sm bg-[#FFC72C] px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-brand-navy transition hover:-translate-y-0.5 hover:bg-[#e6b32a]";

  const cta = (href: string, key: string, label: string, className: string, iconSize = 18) =>
    editor ? (
      <span className={className}>
        {ed(key, label)}
        <ArrowRight size={iconSize} />
      </span>
    ) : (
      <Link href={href} className={className}>
        {label}
        <ArrowRight size={iconSize} />
      </Link>
    );

  return (
    <div className="overflow-hidden bg-[#FAF6ED] text-brand-navy">
      {/* Hero */}
      <section className="relative w-full">
        <div className="relative">
          <Image
            src={heroSrc}
            alt="A student receiving books and school supplies from community leaders"
            width={1774}
            height={887}
            priority
            sizes="100vw"
            className="block h-auto w-full"
            unoptimized={heroSrc.startsWith("blob:")}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#071B2C]/85 via-[#071B2C]/50 to-[#071B2C]/25" />
          {replaceBtn("hero")}
        </div>
        <div className="px-6 pb-10 lg:absolute lg:inset-0 lg:flex lg:items-center lg:pl-10 lg:pr-24 lg:pb-0">
          <div className="-mt-24 w-full max-w-lg rounded-lg bg-[#FAF7F2] p-7 text-center shadow-xl sm:p-10 lg:mt-0">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-navy/70">{ed("cardEyebrow", t.cardEyebrow)}</p>
            <h2 className="mt-5 font-serif text-3xl font-semibold leading-[1.15] text-brand-navy sm:text-4xl lg:text-[2.6rem]">{ed("cardTitle", t.cardTitle, true)}</h2>
            <p className="mt-5 font-semibold leading-relaxed text-brand-navy">{ed("cardBold", t.cardBold, true)}</p>
            <p className="mt-4 text-sm leading-relaxed text-brand-body sm:text-base">{ed("cardBody", t.cardBody, true)}</p>
            {cta("/donate?program=education", "cardCta", t.cardCta, ctaClass)}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles className="mx-auto mb-6 text-brand-orange" size={34} strokeWidth={1.5} />
          <h2 className="type-section-title text-balance">{ed("introTitle", t.introTitle, true)}</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-brand-body sm:text-xl">{ed("introBody", t.introBody, true)}</p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-[#EDE7DC] px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative min-h-[520px] overflow-hidden rounded-sm shadow-2xl lg:min-h-[680px]">
            <Image src={storySrc} alt="Students learning in a classroom" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" unoptimized={storySrc.startsWith("blob:")} />
            {replaceBtn("story")}
          </div>
          <div>
            <p className="type-eyebrow text-brand-green">{ed("storyEyebrow", t.storyEyebrow)}</p>
            <h2 className="type-section-title mt-5 text-balance">{ed("storyTitle", t.storyTitle, true)}</h2>
            <p className="mt-7 text-lg leading-8 text-brand-body">{ed("storyBody", t.storyBody, true)}</p>
            <p className="mt-10 border-l-4 border-[#FFC72C] pl-7 font-serif text-3xl leading-tight text-brand-navy sm:text-4xl">
              {ed("quote", t.quote, true)}
            </p>
            <p className="mt-6 text-base leading-relaxed text-slate-600">{ed("storyNote", t.storyNote, true)}</p>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-brand-navy px-6 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">{ed("bandTitle", t.bandTitle, true)}</h2>
          {cta(
            "/donate?program=education",
            "bandCta",
            t.bandCta,
            "inline-flex shrink-0 items-center gap-3 rounded-sm bg-[#FFC72C] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-brand-navy transition hover:bg-white",
            20,
          )}
        </div>
      </section>

      {/* Questions */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="type-eyebrow text-brand-green">{ed("questionsEyebrow", t.questionsEyebrow)}</p>
            <h2 className="type-section-title mt-5 text-balance">{ed("questionsTitle", t.questionsTitle, true)}</h2>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-[#DED6C8] bg-[#DED6C8] lg:grid-cols-3">
            {t.questions.map((item, index) => {
              const Icon = QUESTION_ICONS[index] ?? School;
              return (
                <article key={index} className="bg-white p-8 sm:p-10">
                  <Icon size={36} strokeWidth={1.5} className="text-brand-orange" />
                  <h3 className="mt-8 font-serif text-3xl font-semibold leading-tight">{ed(`questions.${index}.title`, item.title, true)}</h3>
                  <p className="mt-5 leading-7 text-brand-body">{ed(`questions.${index}.body`, item.body, true)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full-bleed future */}
      <section className="relative isolate min-h-[620px] px-6 py-24 text-white">
        <Image src={futureSrc} alt="Young people looking toward their future" fill sizes="100vw" className="-z-20 object-cover" unoptimized={futureSrc.startsWith("blob:")} />
        <div className="absolute inset-0 -z-10 bg-brand-green/85" />
        {replaceBtn("future")}
        <div className="mx-auto flex min-h-[430px] max-w-7xl items-center">
          <div className="max-w-3xl">
            <p className="type-eyebrow text-[#FFD15C]">{ed("futureEyebrow", t.futureEyebrow)}</p>
            <h2 className="mt-6 text-balance font-serif text-5xl font-semibold leading-[1.02] sm:text-7xl">{ed("futureTitle", t.futureTitle, true)}</h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">{ed("futureBody", t.futureBody, true)}</p>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="bg-white px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="type-eyebrow text-brand-green">{ed("storiesEyebrow", t.storiesEyebrow)}</p>
          <h2 className="type-section-title mt-5 max-w-3xl text-balance">{ed("storiesTitle", t.storiesTitle, true)}</h2>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {t.stories.map((story, index) => (
              <article key={index} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image src={story.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized={story.image.startsWith("blob:")} />
                  {replaceBtn(index)}
                </div>
                <p className="type-eyebrow mt-7 text-brand-orange">{ed(`stories.${index}.tag`, story.tag)}</p>
                <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight">{ed(`stories.${index}.title`, story.title, true)}</h3>
                <p className="mt-4 leading-7 text-brand-body">{ed(`stories.${index}.body`, story.body, true)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#FFC72C] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance font-serif text-5xl font-semibold leading-tight sm:text-6xl">{ed("finalTitle", t.finalTitle, true)}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-navy/80">{ed("finalBody", t.finalBody, true)}</p>
          {cta(
            "/donate?program=education",
            "finalCta",
            t.finalCta,
            "mt-9 inline-flex items-center gap-3 rounded-sm bg-brand-navy px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-brand-green",
            20,
          )}
        </div>
      </section>
    </div>
  );
}
