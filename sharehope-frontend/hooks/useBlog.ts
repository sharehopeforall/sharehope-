"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/lib/api/blog";
import type { BlogPageSettings, BlogPostInput } from "@/types/blog";

const key = ["admin-blog"];

export function useAdminBlogPosts() {
  return useQuery({ queryKey: key, queryFn: blogApi.listAdmin });
}

export function useBlogSettings() { return useQuery({ queryKey: ["blog-settings"], queryFn: blogApi.getSettings }); }
export function useUpdateBlogSettings() { const client = useQueryClient(); return useMutation({ mutationFn: (data: BlogPageSettings) => blogApi.updateSettings(data), onSuccess: () => client.invalidateQueries({ queryKey: ["blog-settings"] }) }); }

export function useCreateBlogPost() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (data: BlogPostInput) => blogApi.create(data), onSuccess: () => client.invalidateQueries({ queryKey: key }) });
}

export function useUpdateBlogPost() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: BlogPostInput }) => blogApi.update(id, data), onSuccess: () => client.invalidateQueries({ queryKey: key }) });
}

export function usePublishBlogPost() {
  const client = useQueryClient();
  return useMutation({ mutationFn: blogApi.publish, onSuccess: () => client.invalidateQueries({ queryKey: key }) });
}

export function useUnpublishBlogPost() {
  const client = useQueryClient();
  return useMutation({ mutationFn: blogApi.unpublish, onSuccess: () => client.invalidateQueries({ queryKey: key }) });
}

export function useDeleteBlogPost() {
  const client = useQueryClient();
  return useMutation({ mutationFn: blogApi.remove, onSuccess: () => client.invalidateQueries({ queryKey: key }) });
}
