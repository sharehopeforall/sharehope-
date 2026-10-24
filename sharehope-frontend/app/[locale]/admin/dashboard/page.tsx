import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHeader title="Dashboard" />
      <AdminDashboardClient />
    </>
  );
}
