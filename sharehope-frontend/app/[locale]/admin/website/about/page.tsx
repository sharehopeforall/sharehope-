import { redirect } from "@/i18n/navigation";

export default async function LegacyAboutAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect({ href: "/admin/dashboard", locale });
}
