import { AdminHeader } from "@/components/admin/AdminHeader";
import { TeamDirectoryClient } from "@/components/admin/TeamDirectoryClient";

export default function AdminTeamPage() {
  return (
    <>
      <AdminHeader title="Team" />
      <TeamDirectoryClient />
    </>
  );
}
