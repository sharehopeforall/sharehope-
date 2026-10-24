import { useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminTestimonialsPage() {
  const t = useTranslations("Admin");

  return (
    <>
      <AdminHeader title={t("testimonials")} />
      <div className="p-6">Testimonials management coming soon.</div>
    </>
  );
}
