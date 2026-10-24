import { apiClient } from "@/lib/api/client";
import type { TeamMember, TeamMemberInput } from "@/types/team";

export const teamApi = {
  list: () => apiClient.get<TeamMember[]>("/admin/team"),
  create: (data: TeamMemberInput) => apiClient.post<TeamMember>("/admin/team", data),
  update: (id: string, data: TeamMemberInput) => apiClient.put<TeamMember>(`/admin/team/${id}`, data),
  remove: (id: string) => apiClient.delete<void>(`/admin/team/${id}`),
};
