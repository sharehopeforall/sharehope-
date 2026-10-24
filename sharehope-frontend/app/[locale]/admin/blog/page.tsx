import { useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogAdminClient } from "@/components/admin/BlogAdminClient";

export default function AdminBlogPage() {
  const t = useTranslations("Admin");

  return (
    <>
      <AdminHeader title={t("blog")} />
      <BlogAdminClient />
    </>
  );
}
