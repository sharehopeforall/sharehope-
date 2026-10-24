import { useTranslations } from "next-intl";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EventsAdminClient } from "@/components/admin/EventsAdminClient";

export default function AdminEventsPage() {
  const t = useTranslations("Admin");

  return (
    <>
      <AdminHeader title={t("events")} />
      <EventsAdminClient />
    </>
  );
}
