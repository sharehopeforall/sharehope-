import { useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProgramsAdminClient } from "@/components/admin/ProgramsAdminClient";

export default function AdminProgramsPage() {
  const t = useTranslations("Admin");

  return (
    <>
      <AdminHeader title={t("programs")} />
      <ProgramsAdminClient />
    </>
  );
}
