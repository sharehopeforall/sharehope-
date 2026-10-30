import PublicPageHeader from "@/components/public/PublicPageHeader";
import { Link } from "@/i18n/navigation";
import { getManagedMetadata, getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return getManagedMetadata("privacy", locale, "Privacy Policy | ShareHope");
}

const content = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: September 23, 2026",
    intro: "ShareHope respects your privacy. This policy explains what information this website collects and how we use and protect it.",
    sections: [
      { title: "Information we collect", body: "When you join our newsletter, we collect your email address and, if you choose to provide them, your first and last name. The website may also receive basic technical information needed to operate securely, such as browser, device, and request information." },
      { title: "How we use information", body: "We use newsletter information to send ShareHope updates, community stories, program news, and opportunities to get involved. We also use technical information to maintain, secure, and improve the website." },
      { title: "How we share information", body: "We do not sell your personal information. Information may be processed by service providers that help us operate the website or deliver communications, subject to appropriate safeguards." },
      { title: "Retention and security", body: "We retain information only as long as reasonably necessary for the purposes described here. We use reasonable administrative and technical measures to protect personal information, although no online system can guarantee absolute security." },
      { title: "Your choices", body: "You may unsubscribe from newsletter communications at any time using the unsubscribe option in our emails. You may also contact us to ask about, correct, or request deletion of information you provided." },
      { title: "Policy updates", body: "We may update this policy as our website and practices change. The date shown above identifies the latest revision." },
    ],
    contactTitle: "Questions about privacy?",
    contactBody: "Contact ShareHope and we will respond to your privacy question or request.",
    contactLink: "Contact Us",
  },
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 23 septembre 2026",
    intro: "ShareHope respecte votre vie privée. Cette politique explique les renseignements recueillis par ce site et la façon dont nous les utilisons et les protégeons.",
    sections: [
      { title: "Renseignements recueillis", body: "Lorsque vous vous abonnez à notre infolettre, nous recueillons votre adresse courriel et, si vous choisissez de les fournir, votre prénom et votre nom. Le site peut également recevoir les renseignements techniques de base nécessaires à son fonctionnement sécurisé." },
      { title: "Utilisation des renseignements", body: "Nous utilisons les renseignements d'abonnement pour envoyer des nouvelles de ShareHope, des histoires de nos communautés, des informations sur nos programmes et des occasions de vous impliquer. Les renseignements techniques servent à maintenir, sécuriser et améliorer le site." },
      { title: "Partage des renseignements", body: "Nous ne vendons pas vos renseignements personnels. Des fournisseurs de services peuvent les traiter afin de nous aider à exploiter le site ou à envoyer nos communications, sous réserve de mesures de protection appropriées." },
      { title: "Conservation et sécurité", body: "Nous conservons les renseignements uniquement pendant la durée raisonnablement nécessaire aux fins décrites ici. Nous utilisons des mesures administratives et techniques raisonnables pour les protéger, mais aucun système en ligne ne peut garantir une sécurité absolue." },
      { title: "Vos choix", body: "Vous pouvez vous désabonner de l'infolettre à tout moment au moyen du lien prévu dans nos courriels. Vous pouvez aussi nous contacter pour demander l'accès, la correction ou la suppression des renseignements fournis." },
      { title: "Mises à jour", body: "Nous pouvons mettre à jour cette politique lorsque notre site ou nos pratiques évoluent. La date ci-dessus indique la plus récente révision." },
    ],
    contactTitle: "Des questions sur la confidentialité ?",
    contactBody: "Contactez ShareHope pour toute question ou demande concernant vos renseignements personnels.",
    contactLink: "Nous contacter",
  },
} as const;

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const base = locale === "fr" ? content.fr : content.en;
  const managed = await getManagedPage("privacy", locale);
  const page = { ...base, title: managed?.title || base.title, updated: managed?.subtitle || base.updated, intro: managed?.body || base.intro, contactLink: managed?.buttonText || base.contactLink };

  return (
    <>
      <PublicPageHeader title={page.title} />
      <section className="bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-[820px]">
          <p className="type-supporting text-role-muted">{page.updated}</p>
          <p className="type-lead text-role-secondary mt-5">{page.intro}</p>
          <div className="mt-12 space-y-10">
            {page.sections.map((section) => (
              <section key={section.title}>
                <h2 className="type-subsection-title text-role-primary">{section.title}</h2>
                <p className="type-body text-role-secondary mt-4">{section.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-14 rounded-2xl bg-[#EFF6FF] p-7 sm:p-8">
            <h2 className="type-card-title text-[#0B2746]">{page.contactTitle}</h2>
            <p className="type-body text-role-secondary mt-3">{page.contactBody}</p>
            <Link href="/contact" className="type-button mt-5 inline-flex rounded-lg bg-[#FF5917] px-6 py-3 text-white transition hover:bg-[#E94E0B]">{page.contactLink}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
