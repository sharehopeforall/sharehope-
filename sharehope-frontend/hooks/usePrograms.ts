"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { programsApi } from "@/lib/api/programs";
import type { ProgramInput } from "@/types/program";
export function useAdminPrograms() { return useQuery({ queryKey: ["admin-programs"], queryFn: programsApi.listAdmin }); }
export function useCreateProgram() { const client = useQueryClient(); return useMutation({ mutationFn: (data: ProgramInput) => programsApi.create(data), onSuccess: () => client.invalidateQueries({ queryKey: ["admin-programs"] }) }); }
export function useUpdateProgram() { const client = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: ProgramInput }) => programsApi.update(id, data), onSuccess: () => client.invalidateQueries({ queryKey: ["admin-programs"] }) }); }
export function useDeleteProgram() { const client = useQueryClient(); return useMutation({ mutationFn: programsApi.remove, onSuccess: () => client.invalidateQueries({ queryKey: ["admin-programs"] }) }); }
