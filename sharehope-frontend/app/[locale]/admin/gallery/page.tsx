import { useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminGalleryPage() {
  const t = useTranslations("Admin");

  return (
    <>
      <AdminHeader title={t("gallery")} />
      <div className="p-6">Gallery management coming soon.</div>
    </>
  );
}
