import Image from "next/image";
import { BookOpen, Flame, HandHeart, HeartPulse, Music, PlayCircle, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import MinistryPrayer from "./MinistryPrayer";

const ACTIVITY_ICONS = [Music, BookOpen, Users, HandHeart] as const;
const OUTREACH_ICONS = [HandHeart, HeartPulse] as const;

// Set ONE of these to show the outreach video:
// - youtubeId: the ID from a YouTube link (youtube.com/watch?v=THIS_PART)
// - src: a video file URL, e.g. "/videos/outreach.mp4" (placed in public/videos) or a Vercel Blob URL
const OUTREACH_VIDEO = {
  youtubeId: "",
  src: "",
  poster: "/images/ministry/video-cover.jpg",
};

// Replace these with the ministry's own photos (local files in public/images or Vercel Blob URLs).
const OUTREACH_PHOTOS = [
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80",
] as const;

const copy = {
  en: {
    eyebrow: "Our ministry",
    title: "Raising a generation on fire for God.",
    lead: "At the heart of ShareHope is a calling: to see young people encounter Christ, to stand with widows, and to bring comfort to the sick — carrying hope wherever it is needed most.",
    heroImageAlt: "Young people worshipping together",
    letterEyebrow: "A word from our founder",
    letterTitle: "Why I believe in this generation",
    letter: [
      "When I look at the young people we serve, I don't see a problem to solve — I see a generation God is preparing. Many of them carry heavy stories, but I have watched again and again as faith turns pain into purpose.",
      "That is why we started Youth on Fire for Jesus. Not just to fill a room for an evening, but to build a family where young people are known, discipled, and sent out. Education opens doors. Faith gives them the courage to walk through them.",
      "And our calling doesn't stop with the young. Scripture asks us to care for widows and to visit the sick, so we walk with widows in our community and bring prayer and comfort to people in hospital.",
      "I invite you to stand with us — in prayer, in presence, and in partnership.",
    ],
    letterSignature: "Marie L.",
    letterRole: "Founder & Director",
    programEyebrow: "Youth on Fire for Jesus",
    programTitle: "A place to belong, believe, and become.",
    programBody: "Youth on Fire for Jesus is our youth ministry for ages 13–25. Every gathering is a space to worship freely, grow in the Word, build real friendships, and serve the community together.",
    programImageAlt: "Young people gathered at a Youth on Fire for Jesus meeting",
    programCta: "Join us",
    activities: [
      { title: "Worship", body: "Passionate, youth-led worship that invites everyone into God's presence." },
      { title: "The Word", body: "Bible teaching and small groups that make Scripture practical for everyday life." },
      { title: "Mentorship", body: "Trusted leaders walking alongside each young person through school, family, and faith." },
      { title: "Outreach", body: "Serving neighbors through community projects, visits, and acts of kindness." },
    ],
    outreachEyebrow: "Compassion in action",
    outreachTitle: "Caring for widows and the sick",
    outreachLead: "“Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress.” — James 1:27",
    outreach: [
      { title: "Widows' care", body: "We visit widows in their homes, provide food and practical support, help with school fees for their children, and gather them for fellowship and prayer so no one walks through grief alone." },
      { title: "Hospital visits", body: "Our team visits patients and families in local hospitals to pray with them, bring care packages, and offer a listening ear — and helps with medical costs for those who cannot afford treatment." },
    ],
    videoTitle: "See the ministry in action",
    videoPlaceholder: "Video coming soon",
    galleryTitle: "Moments from the field",
    galleryAlts: [
      "Team members visiting a widow at her home",
      "A volunteer praying with a patient in hospital",
      "Widows gathered for fellowship",
      "Care packages being prepared for hospital visits",
      "Hands joined together in prayer",
    ],
    prayerEyebrow: "Pray with us",
    prayerTitle: "Join us in prayer",
    prayerLead: "Our founder invites you to pray with us for the people this ministry serves.",
    prayerCommit: "I'll pray for this",
    prayerCommitted: "Thank you for praying",
    prayerGroups: [
      {
        title: "Youth",
        intro: "Young people today face pressure from every side. Pray that they would find their identity in Christ and the courage to lead.",
        image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Young people gathered together",
        keyVerse: "“For I know the plans I have for you, plans to give you hope and a future.”",
        keyVerseRef: "Jeremiah 29:11",
        prayers: [
          { title: "Salvation & identity", body: "That every young person would encounter Jesus and know they are loved, chosen, and created with purpose.", verse: "Jeremiah 29:11" },
          { title: "Protection", body: "For safety from violence, addiction, and every influence that seeks to steal their future.", verse: "Psalm 91:11" },
          { title: "Bold leaders", body: "That God would raise up young leaders who carry hope and integrity into their communities and nations.", verse: "1 Timothy 4:12" },
        ],
      },
      {
        title: "Widows",
        intro: "Many widows carry grief, loneliness, and the weight of providing for their families alone. Pray for comfort, provision, and community.",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "A widow receiving a visit at home",
        keyVerse: "“A father to the fatherless, a defender of widows, is God in his holy dwelling.”",
        keyVerseRef: "Psalm 68:5",
        prayers: [
          { title: "Comfort in grief", body: "That God would heal broken hearts and surround every widow with His peace and presence.", verse: "Psalm 34:18" },
          { title: "Provision", body: "For daily bread, shelter, and the means to care for their children and households.", verse: "Philippians 4:19" },
          { title: "Community & dignity", body: "That widows would be honored, protected from injustice, and never feel forgotten.", verse: "Psalm 68:5" },
        ],
      },
      {
        title: "The sick",
        intro: "Every week our team sits beside hospital beds. Pray for healing, for strength for families, and for those who care for the sick.",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "A hospital room",
        keyVerse: "“I will restore you to health and heal your wounds,” declares the Lord.",
        keyVerseRef: "Jeremiah 30:17",
        prayers: [
          { title: "Healing", body: "For healing in body, mind, and spirit for every patient we visit.", verse: "Jeremiah 30:17" },
          { title: "Strength for families", body: "For peace and endurance for the families keeping watch beside hospital beds.", verse: "Isaiah 41:10" },
          { title: "Wisdom for caregivers", body: "For doctors, nurses, and caregivers — that God would guide their hands and renew their strength.", verse: "Isaiah 40:31" },
        ],
      },
    ],
    closingVerse: "“Don't let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.”",
    closingVerseRef: "1 Timothy 4:12",
    ctaTitle: "Stand with us.",
    ctaBody: "Volunteer as a mentor or visitor, support the ministry, or simply commit to pray.",
    ctaPrimary: "Volunteer with us",
    ctaSecondary: "Support the ministry",
  },
  fr: {
    eyebrow: "Notre ministère",
    title: "Élever une génération en feu pour Dieu.",
    lead: "Au cœur de ShareHope se trouve un appel : voir les jeunes rencontrer Christ, soutenir les veuves et apporter du réconfort aux malades — porter l'espérance là où elle manque le plus.",
    heroImageAlt: "Des jeunes qui adorent ensemble",
    letterEyebrow: "Un mot de notre fondatrice",
    letterTitle: "Pourquoi je crois en cette génération",
    letter: [
      "Quand je regarde les jeunes que nous servons, je ne vois pas un problème à résoudre — je vois une génération que Dieu prépare. Beaucoup portent des histoires lourdes, mais j'ai vu encore et encore la foi transformer la douleur en destinée.",
      "C'est pour cela que nous avons lancé Youth on Fire for Jesus. Pas seulement pour remplir une salle le temps d'une soirée, mais pour bâtir une famille où les jeunes sont connus, formés comme disciples et envoyés. L'éducation ouvre des portes. La foi leur donne le courage de les franchir.",
      "Et notre appel ne s'arrête pas aux jeunes. L'Écriture nous demande de prendre soin des veuves et de visiter les malades : nous marchons donc aux côtés des veuves de notre communauté et apportons prière et réconfort aux personnes hospitalisées.",
      "Je vous invite à vous tenir à nos côtés — par la prière, la présence et le partenariat.",
    ],
    letterSignature: "Marie L.",
    letterRole: "Fondatrice et directrice",
    programEyebrow: "Youth on Fire for Jesus",
    programTitle: "Un lieu pour appartenir, croire et grandir.",
    programBody: "Youth on Fire for Jesus est notre ministère jeunesse pour les 13 à 25 ans. Chaque rencontre est un espace pour adorer librement, grandir dans la Parole, tisser de vraies amitiés et servir la communauté ensemble.",
    programImageAlt: "Des jeunes réunis lors d'une rencontre Youth on Fire for Jesus",
    programCta: "Nous rejoindre",
    activities: [
      { title: "Adoration", body: "Une louange passionnée, menée par les jeunes, qui invite chacun dans la présence de Dieu." },
      { title: "La Parole", body: "Enseignement biblique et petits groupes qui rendent l'Écriture concrète au quotidien." },
      { title: "Mentorat", body: "Des leaders de confiance qui accompagnent chaque jeune à l'école, en famille et dans la foi." },
      { title: "Action", body: "Servir nos voisins par des projets communautaires, des visites et des gestes de bonté." },
    ],
    outreachEyebrow: "La compassion en action",
    outreachTitle: "Prendre soin des veuves et des malades",
    outreachLead: "« La religion pure et sans tache, devant Dieu notre Père, consiste à visiter les orphelins et les veuves dans leurs afflictions. » — Jacques 1.27",
    outreach: [
      { title: "Soutien aux veuves", body: "Nous visitons les veuves chez elles, offrons nourriture et aide concrète, contribuons aux frais de scolarité de leurs enfants et les réunissons pour la communion fraternelle et la prière, afin que personne ne traverse le deuil seule." },
      { title: "Visites à l'hôpital", body: "Notre équipe visite les patients et leurs familles dans les hôpitaux locaux pour prier avec eux, apporter des colis de soins et offrir une écoute — et aide à payer les soins de ceux qui n'en ont pas les moyens." },
    ],
    videoTitle: "Le ministère en action",
    videoPlaceholder: "Vidéo à venir",
    galleryTitle: "Moments sur le terrain",
    galleryAlts: [
      "Des membres de l'équipe rendent visite à une veuve chez elle",
      "Une bénévole prie avec un patient à l'hôpital",
      "Des veuves réunies pour un temps de communion",
      "Préparation de colis de soins pour les visites à l'hôpital",
      "Des mains jointes dans la prière",
    ],
    prayerEyebrow: "Priez avec nous",
    prayerTitle: "Joignez-vous à notre prière",
    prayerLead: "Notre fondatrice vous invite à prier avec nous pour les personnes que ce ministère sert.",
    prayerCommit: "Je vais prier pour cela",
    prayerCommitted: "Merci de prier",
    prayerGroups: [
      {
        title: "Jeunesse",
        intro: "Les jeunes d'aujourd'hui subissent des pressions de toutes parts. Priez pour qu'ils trouvent leur identité en Christ et le courage de diriger.",
        image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des jeunes réunis",
        keyVerse: "« Car je connais les projets que j'ai formés sur vous, des projets de paix, afin de vous donner un avenir et de l'espérance. »",
        keyVerseRef: "Jérémie 29.11",
        prayers: [
          { title: "Salut et identité", body: "Que chaque jeune rencontre Jésus et sache qu'il est aimé, choisi et créé avec un but.", verse: "Jérémie 29.11" },
          { title: "Protection", body: "Pour une protection contre la violence, les dépendances et toute influence qui cherche à voler leur avenir.", verse: "Psaume 91.11" },
          { title: "Des leaders audacieux", body: "Que Dieu suscite de jeunes leaders qui portent l'espérance et l'intégrité dans leurs communautés et leurs nations.", verse: "1 Timothée 4.12" },
        ],
      },
      {
        title: "Veuves",
        intro: "Beaucoup de veuves portent le deuil, la solitude et la charge de subvenir seules aux besoins de leur famille. Priez pour le réconfort, la provision et la communauté.",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Une veuve reçoit une visite chez elle",
        keyVerse: "« Le père des orphelins, le défenseur des veuves, c'est Dieu dans sa demeure sainte. »",
        keyVerseRef: "Psaume 68.6",
        prayers: [
          { title: "Réconfort dans le deuil", body: "Que Dieu guérisse les cœurs brisés et entoure chaque veuve de Sa paix et de Sa présence.", verse: "Psaume 34.19" },
          { title: "Provision", body: "Pour le pain quotidien, un toit et les moyens de prendre soin de leurs enfants et de leur foyer.", verse: "Philippiens 4.19" },
          { title: "Communauté et dignité", body: "Que les veuves soient honorées, protégées de l'injustice et ne se sentent jamais oubliées.", verse: "Psaume 68.6" },
        ],
      },
      {
        title: "Malades",
        intro: "Chaque semaine, notre équipe s'assoit au chevet des patients. Priez pour la guérison, la force des familles et ceux qui prennent soin des malades.",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Une chambre d'hôpital",
        keyVerse: "« Je te guérirai, je panserai tes plaies, dit l'Éternel. »",
        keyVerseRef: "Jérémie 30.17",
        prayers: [
          { title: "Guérison", body: "Pour la guérison du corps, de l'esprit et de l'âme de chaque patient que nous visitons.", verse: "Jérémie 30.17" },
          { title: "Force pour les familles", body: "Pour la paix et l'endurance des familles qui veillent au chevet de leurs proches.", verse: "Ésaïe 41.10" },
          { title: "Sagesse pour les soignants", body: "Pour les médecins, infirmières et soignants — que Dieu guide leurs mains et renouvelle leurs forces.", verse: "Ésaïe 40.31" },
        ],
      },
    ],
    closingVerse: "« Que personne ne méprise ta jeunesse ; mais sois un modèle pour les fidèles, en parole, en conduite, en amour, en foi, en pureté. »",
    closingVerseRef: "1 Timothée 4.12",
    ctaTitle: "Tenez-vous à nos côtés.",
    ctaBody: "Devenez mentor ou visiteur bénévole, soutenez le ministère, ou engagez-vous simplement à prier.",
    ctaPrimary: "Devenir bénévole",
    ctaSecondary: "Soutenir le ministère",
  },
} as const;

function OutreachVideo({ title, placeholder }: { title: string; placeholder: string }) {
  if (OUTREACH_VIDEO.youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${OUTREACH_VIDEO.youtubeId}`}
        title={title}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }
  if (OUTREACH_VIDEO.src) {
    return (
      <video
        src={OUTREACH_VIDEO.src}
        poster={OUTREACH_VIDEO.poster}
        controls
        playsInline
        className="absolute inset-0 h-full w-full bg-black object-contain"
      />
    );
  }
  return (
    <>
      <video
        data-visual-key="ministry-outreach-video"
        poster={OUTREACH_VIDEO.poster}
        controls
        playsInline
        preload="metadata"
        aria-label={title}
        className="absolute inset-0 h-full w-full bg-black object-contain"
      />
      <div data-video-placeholder className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-navy/60 text-white">
        <PlayCircle size={64} strokeWidth={1.25} />
        <p className="font-mono-spaced text-xs font-bold uppercase">{placeholder}</p>
      </div>
    </>
  );
}

export default function MinistryContent({ locale }: { locale: string }) {
  const t = locale === "fr" ? copy.fr : copy.en;

  return (
    <div className="bg-brand-cream text-[#121212]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-navy text-white">
        <Image
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1800&q=80"
          alt={t.heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/30" />
        <div className="mx-auto flex min-h-[560px] max-w-4xl flex-col items-center justify-end px-6 pb-20 pt-32 text-center">
          <p className="font-mono-spaced flex items-center gap-2 text-xs font-bold uppercase text-[#FFC72C]">
            <Flame size={14} /> {t.eyebrow}
          </p>
          <h1 className="font-serif mt-5 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">{t.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{t.lead}</p>
        </div>
      </section>

      {/* Founder's letter */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-mono-spaced text-xs font-bold uppercase text-[#2D8A56]">{t.letterEyebrow}</p>
        <h2 className="font-serif mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">{t.letterTitle}</h2>
        <div className="mt-8 space-y-5">
          {t.letter.map((paragraph, i) => (
            <p key={i} className="font-serif text-lg leading-[1.8] text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-8 border-t border-[#E5E0D8] pt-6">
          <p className="font-handwriting text-3xl font-bold text-brand-navy">{t.letterSignature}</p>
          <p className="font-mono-spaced mt-1 text-[10px] font-bold uppercase text-slate-500">{t.letterRole}</p>
        </div>
      </section>

      {/* Youth on Fire for Jesus */}
      <section className="relative isolate overflow-hidden bg-brand-navy px-6 pb-20 pt-12 text-white lg:pb-24 lg:pt-14">
        <div className="absolute -left-32 top-0 -z-10 h-[420px] w-[420px] rounded-full bg-[#2F5BB7]/30 blur-3xl" />
        <div className="absolute -bottom-40 right-0 -z-10 h-[380px] w-[380px] rounded-full bg-[#13306B]/60 blur-3xl" />
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">{t.programEyebrow}</h2>
              <p className="font-serif mt-3 text-xl italic text-[#A9C4F5]">{t.programTitle}</p>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70">{t.programBody}</p>
              <Link
                href="/contact?topic=youth"
                className="font-mono-spaced mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#13306B] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#E6EEFB]"
              >
                {t.programCta} →
              </Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 -z-10 rotate-2 rounded-3xl bg-gradient-to-br from-[#2F5BB7] to-[#A9C4F5] opacity-80" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80"
                  alt={t.programImageAlt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {t.activities.map((activity, i) => {
              const Icon = ACTIVITY_ICONS[i];
              return (
                <div key={activity.title} className="bg-brand-navy p-6 transition-colors hover:bg-[#13306B]">
                  <Icon size={22} className="text-[#A9C4F5]" />
                  <h3 className="font-serif mt-4 text-lg font-semibold">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{activity.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Widows & hospital outreach */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono-spaced text-xs font-bold uppercase text-[#2D8A56]">{t.outreachEyebrow}</p>
          <h2 className="font-serif mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">{t.outreachTitle}</h2>
          <p className="font-serif mt-5 text-lg italic leading-relaxed text-slate-600">{t.outreachLead}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {t.outreach.map((item, i) => {
            const Icon = OUTREACH_ICONS[i];
            return (
              <div key={item.title} className="rounded-xl border border-[#E5E0D8] bg-white p-7 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#2D8A56] text-white">
                  <Icon size={20} />
                </div>
                <h3 className="font-serif mt-4 text-2xl font-semibold text-brand-navy">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{item.body}</p>
              </div>
            );
          })}
        </div>

        {/* Video */}
        <div className="mt-16">
          <h3 className="font-serif text-center text-2xl font-bold text-brand-navy sm:text-3xl">{t.videoTitle}</h3>
          <div className="relative mx-auto mt-8 aspect-video max-w-5xl overflow-hidden rounded-2xl bg-brand-navy shadow-xl">
            <OutreachVideo title={t.videoTitle} placeholder={t.videoPlaceholder} />
          </div>
        </div>

        {/* Photo gallery */}
        <div className="mt-16">
          <h3 className="font-serif text-center text-2xl font-bold text-brand-navy sm:text-3xl">{t.galleryTitle}</h3>
          <div className="mt-8 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-4">
            {OUTREACH_PHOTOS.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <Image
                  src={src}
                  alt={t.galleryAlts[i]}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <MinistryPrayer
        eyebrow={t.prayerEyebrow}
        title={t.prayerTitle}
        lead={t.prayerLead}
        commitLabel={t.prayerCommit}
        committedLabel={t.prayerCommitted}
        groups={t.prayerGroups}
      />

      {/* Closing verse */}
      <section className="px-6 pt-20 text-center">
        <figure className="mx-auto max-w-3xl">
          <blockquote className="font-serif text-2xl font-medium leading-relaxed text-brand-navy sm:text-3xl">{t.closingVerse}</blockquote>
          <figcaption className="font-mono-spaced mt-6 text-xs font-bold uppercase text-[#F05A24]">{t.closingVerseRef}</figcaption>
        </figure>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="font-serif text-3xl font-bold text-brand-navy sm:text-4xl">{t.ctaTitle}</h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t.ctaBody}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/volunteer"
              className="font-mono-spaced inline-flex items-center rounded-lg bg-[#FFC72C] px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#121212] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#E2AD17]"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href="/donate"
              className="font-mono-spaced inline-flex items-center rounded-lg border-2 border-brand-navy px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-brand-navy hover:text-white"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
