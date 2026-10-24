import { apiClient } from "@/lib/api/client";
import type { AdminBlogPost, BlogPageSettings, BlogPostInput } from "@/types/blog";

export const blogApi = {
  listAdmin: () => apiClient.get<AdminBlogPost[]>("/admin/blog"),
  getSettings: () => apiClient.get<BlogPageSettings>("/admin/blog/settings"),
  updateSettings: (data: BlogPageSettings) => apiClient.put<BlogPageSettings>("/admin/blog/settings", data),
  create: (data: BlogPostInput) => apiClient.post<AdminBlogPost>("/admin/blog", data),
  update: (id: string, data: BlogPostInput) => apiClient.put<AdminBlogPost>(`/admin/blog/${id}`, data),
  publish: (id: string) => apiClient.post<AdminBlogPost>(`/admin/blog/${id}/publish`),
  unpublish: (id: string) => apiClient.post<AdminBlogPost>(`/admin/blog/${id}/unpublish`),
  remove: (id: string) => apiClient.delete<void>(`/admin/blog/${id}`),
};
