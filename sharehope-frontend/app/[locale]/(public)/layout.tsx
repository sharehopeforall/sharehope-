import Navbar from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import type { Metadata } from "next";
import { getManagedPage } from "@/lib/server/site-page";
import { VisualEditingBridge } from "@/components/admin/VisualEditingBridge";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await getManagedPage("seo-social", locale);
  const image = typeof seo?.settings.socialImage === "string" ? seo.settings.socialImage : undefined;
  return {
    title: seo?.title || "ShareHope",
    description: seo?.body || undefined,
    metadataBase: typeof seo?.buttonText === "string" && seo.buttonText.startsWith("http") ? new URL(seo.buttonText) : undefined,
    openGraph: { title: seo?.title || "ShareHope", description: seo?.body || undefined, images: image ? [image] : undefined },
  };
}

export default async function PublicLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const footerContent = await getManagedPage("navigation-footer", locale);
  return (
    <div id="visual-page-root" className="flex min-h-full flex-1 flex-col">
      <VisualEditingBridge />
      <div className="contents" data-visual-editor-ignore>
        <Navbar managed={footerContent} />
      </div>
      <main className="flex-1" data-visual-editor-content>{children}</main>
      <div className="contents" data-visual-editor-ignore>
        <Footer managed={footerContent} />
      </div>
    </div>
  );
}
