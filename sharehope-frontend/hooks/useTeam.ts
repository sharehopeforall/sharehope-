"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "@/lib/api/team";
import type { TeamMemberInput } from "@/types/team";

export function useTeamMembers(enabled = true) {
  return useQuery({ queryKey: ["team-members"], queryFn: teamApi.list, enabled });
}

export function useCreateTeamMember() {
  const client = useQueryClient();
  return useMutation({ mutationFn: teamApi.create, onSuccess: () => client.invalidateQueries({ queryKey: ["team-members"] }) });
}

export function useUpdateTeamMember() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: TeamMemberInput }) => teamApi.update(id, data), onSuccess: () => client.invalidateQueries({ queryKey: ["team-members"] }) });
}

export function useDeleteTeamMember() {
  const client = useQueryClient();
  return useMutation({ mutationFn: teamApi.remove, onSuccess: () => client.invalidateQueries({ queryKey: ["team-members"] }) });
}
