import { apiClient } from "@/lib/api/client";
import type { AdminProgram, ProgramInput, PublicProgram } from "@/types/program";
export const programsApi = {
  listPublic: (locale: string) => apiClient.get<PublicProgram[]>(`/public/programs?locale=${encodeURIComponent(locale)}`, { auth: false }),
  listAdmin: () => apiClient.get<AdminProgram[]>("/admin/programs"),
  create: (data: ProgramInput) => apiClient.post<AdminProgram>("/admin/programs", data),
  update: (id: string, data: ProgramInput) => apiClient.put<AdminProgram>(`/admin/programs/${id}`, data),
  remove: (id: string) => apiClient.delete<void>(`/admin/programs/${id}`),
};
